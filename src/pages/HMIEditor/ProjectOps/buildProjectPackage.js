import JSZip from "jszip";
import { SCHEMA_VERSION, THUMB_SPEC } from "@/pages/HMIEditor/constants";
import { generateThumbnail } from "./generateThumbnail";
import { sha256Blob, sha256Text, stableStringify } from "./utils";

function exportProject(state) {
    return {
        kind: "HMIEditorProject",
        schemaVersion: SCHEMA_VERSION,
        projectName: state.projectName,
        activePageId: state.activePageId,
        pages: state.pages,
        nodes: state.nodes,
    };
}

/**
 * @param {{ state: any, tools?: any }} args
 * @returns {Promise<{ blob: Blob, manifest: any }>}
 */
export async function buildProjectPackage({ state, tools }) {
    const project = exportProject(state);
    const bgColor = state.pages[state.activePageId].backgroundColor;

    // 1) project.json bytes/hash
    const projectJson = JSON.stringify(project, null, 2);
    const projectSha = await sha256Text(projectJson);

    // 2) thumbnail
    let thumbBlob = null;
    try {
        const nodesLayer = tools?.api?.getNodesLayer?.();
        const nodesRef = tools?.nodesRef;
        if (nodesLayer && nodesRef) {
            thumbBlob = await generateThumbnail(nodesLayer, nodesRef, bgColor);
        }
    } catch (e) {
        console.error("Thumbnail generation failed:", e);
        thumbBlob = null;
    }

    let thumbSha = null;
    let thumbBytes = null;
    if (thumbBlob) {
        thumbSha = await sha256Blob(thumbBlob);
        thumbBytes = thumbBlob.size;
    }

    // 3) manifest (без self-hash, чтобы не было рекурсии)
    const exportedAt = new Date().toISOString();
    const files = [
        {
            path: "project.json",
            mime: "application/json",
            bytes: new TextEncoder().encode(projectJson).byteLength,
            sha256: projectSha,
        },
    ];

    if (thumbBlob) {
        files.push({
            path: THUMB_SPEC.path,
            mime: THUMB_SPEC.mime,
            bytes: thumbBytes,
            sha256: thumbSha,
            width: THUMB_SPEC.width,
            height: THUMB_SPEC.height,
        });
    }

    const manifest = {
        format: "tir-project",
        formatVersion: 1,
        schemaVersion: SCHEMA_VERSION,
        projectName: project.projectName,
        activePageId: project.activePageId,
        exportedAt,
        files,
    };

    const manifestJson = stableStringify(manifest, 2);
    const manifestSha = await sha256Text(manifestJson);

    // полезно добавить хеш самого манифеста как отдельный файл (без рекурсии)
    const manifestShaTxt = `${manifestSha}  manifest.json\n`;

    // 4) zip
    const zip = new JSZip();

    zip.file("project.json", projectJson, {
        compression: "DEFLATE",
    });

    zip.file("manifest.json", manifestJson, {
        compression: "DEFLATE",
    });

    // рядом хеш манифеста как "checksum"
    zip.file("manifest.sha256", manifestShaTxt, {
        compression: "DEFLATE",
    });

    if (thumbBlob) {
        // PNG уже сжат — кладём без deflate
        zip.file(THUMB_SPEC.path, thumbBlob, {
            compression: "STORE",
        });
    }

    const blob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
    });

    return { blob, manifest };
}
