import JSZip from "jszip";
import { sha256Bytes, sha256Text } from "./utils";
import {
    ALLOWED_PATHS,
    MAX_ARCHIVE_FILE_SIZE,
    MAX_FILES_IN_ARCHIVE,
    MAX_INFLATED_TOTAL_BYTES,
    MAX_PROJECT_FILE_SIZE,
    MAX_THUMB_FILE_SIZE,
} from "../constants";

function assert(cond, msg) {
    if (!cond) throw new Error(msg);
}

function isSafePath(path) {
    if (typeof path !== "string" || path.length === 0) return false;
    if (path.length > 200) return false;
    if (path.includes("..")) return false;
    if (path.includes("\\")) return false;
    if (path.startsWith("/")) return false;
    if (path.includes(":")) return false; // windows drive / url scheme
    return true;
}

function normalizeAndValidateManifestText(manifestText) {
    let manifest;
    try {
        manifest = JSON.parse(manifestText);
    } catch {
        throw new Error("Некорректный пакет: manifest.json не является JSON");
    }

    assert(
        manifest?.format === "tir-project",
        "Некорректный пакет: неизвестный формат (format != tir-project)",
    );

    assert(
        Array.isArray(manifest.files),
        "Некорректный пакет: manifest.files должен быть массивом",
    );

    // валидация путей из манифеста (в т.ч. allowlist)
    for (const f of manifest.files) {
        const path = f?.path;
        assert(
            typeof path === "string" && path.length > 0,
            "Некорректный пакет: в manifest.files есть запись без path",
        );
        assert(
            isSafePath(path),
            `Некорректный пакет: небезопасный путь ${path}`,
        );
        assert(
            ALLOWED_PATHS.has(path),
            `Некорректный пакет: недопустимый файл в пакете: ${path}`,
        );
        if (typeof f?.sha256 === "string") {
            // базовая sanity-проверка хэша
            assert(
                /^[a-f0-9]{64}$/i.test(f.sha256),
                `Некорректный пакет: sha256 неверного формата для ${path}`,
            );
        }
    }

    return manifest;
}

async function loadZipSafely(fileOrBlob) {
    // размер самого архива
    const size = fileOrBlob?.size ?? null;
    if (typeof size === "number") {
        assert(size <= MAX_ARCHIVE_FILE_SIZE, "Файл слишком большой");
    }

    const ab = await fileOrBlob.arrayBuffer();

    // eslintsonarjs/no-unsafe-unzip
    // Мы распаковываем архив пользователя, но дальше используем allowlist путей и лимиты на размер/кол-во файлов,
    // а также ограничиваем суммарный размер распакованных данных.
    // eslint-disable-next-line
    const zip = await JSZip.loadAsync(ab);

    // быстрые “грубые” проверки по структуре zip (до чтения содержимого)
    const entries = Object.keys(zip.files || {});
    assert(entries.length > 0, "Некорректный пакет: пустой архив");
    assert(
        entries.length <= MAX_FILES_IN_ARCHIVE,
        "Некорректный пакет: слишком много файлов",
    );

    // запрещаем директории и любые странные имена
    for (const name of entries) {
        assert(
            isSafePath(name),
            `Некорректный пакет: небезопасное имя файла ${name}`,
        );
        // JSZip помечает директории флагом dir
        const zf = zip.files[name];
        assert(!zf?.dir, "Некорректный пакет: директории не поддерживаются");
    }

    return zip;
}

async function readRequiredText(zip, path, errMsg) {
    const entry = zip.file(path);
    assert(entry, errMsg);
    return entry.async("string");
}

async function verifyManifestShaOptional(zip, manifestText) {
    const entry = zip.file("manifest.sha256");
    if (!entry) return;

    const expectedLine = (await entry.async("string")).trim();
    const expectedHash = expectedLine.split(/\s+/)[0];
    if (!expectedHash) return;

    const actualHash = await sha256Text(manifestText);
    assert(
        expectedHash === actualHash,
        "Повреждён пакет: manifest.sha256 не совпал",
    );
}

function getDeclaredFileLimits(path) {
    if (path === "project.json") return MAX_PROJECT_FILE_SIZE;
    if (path === "thumbnail.png") return MAX_THUMB_FILE_SIZE;
    if (path === "manifest.json" || path === "manifest.sha256")
        return 128 * 1024;
    return 256 * 1024;
}

async function extractAndVerifyFiles(zip, manifest) {
    const extracted = new Map();
    let inflatedTotal = 0;

    for (const f of manifest.files) {
        const path = f.path;
        const expectedSha = f.sha256;

        const entry = zip.file(path);
        assert(entry, `Некорректный пакет: отсутствует файл ${path}`);

        // читаем bytes (inflate)
        const bytes = await entry.async("uint8array");

        // лимиты на распакованный размер
        const perFileLimit = getDeclaredFileLimits(path);
        assert(
            bytes.byteLength <= perFileLimit,
            `Некорректный пакет: ${path} слишком большой`,
        );

        inflatedTotal += bytes.byteLength;
        assert(
            inflatedTotal <= MAX_INFLATED_TOTAL_BYTES,
            "Некорректный пакет: слишком много распакованных данных",
        );

        // sha256 проверяем, если указан
        if (expectedSha) {
            const actualSha = await sha256Bytes(bytes);
            assert(
                expectedSha === actualSha,
                `Повреждён пакет: sha256 не совпал для ${path}`,
            );
        }

        extracted.set(path, { bytes });
    }

    return extracted;
}

function parseProjectJsonFromExtracted(extracted) {
    const pj = extracted.get("project.json");
    assert(pj, "Некорректный пакет: отсутствует project.json в manifest.files");

    const projectText = new TextDecoder().decode(pj.bytes);

    try {
        return JSON.parse(projectText);
    } catch {
        throw new Error("Некорректный пакет: project.json не является JSON");
    }
}

/**
 * Читает .tir-project (zip), проверяет:
 * - manifest.sha256 (если есть)
 * - sha256 файлов из manifest.json
 * Возвращает: { project, manifest, files }
 */
export async function parseProjectPackage(fileOrBlob) {
    const zip = await loadZipSafely(fileOrBlob);

    // 1) manifest.json обязателен
    const manifestText = await readRequiredText(
        zip,
        "manifest.json",
        "Некорректный пакет: отсутствует manifest.json",
    );

    // 2) проверка manifest.sha256 (если есть)
    await verifyManifestShaOptional(zip, manifestText);

    // 3) parse + validate manifest contents
    const manifest = normalizeAndValidateManifestText(manifestText);

    // 4) extract + verify file hashes with limits
    const extracted = await extractAndVerifyFiles(zip, manifest);

    // 5) parse project.json
    const project = parseProjectJsonFromExtracted(extracted);

    return { project, manifest, files: extracted };
}
