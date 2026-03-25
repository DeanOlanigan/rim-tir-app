import JSZip from "jszip";
import {
    SCHEMA_VERSION,
    SHAPES,
    THUMB_SPEC,
} from "@/pages/HMIEditor/constants";
import { renderPageToBlobOffscreen } from "./generateThumbnail";
import { sha256Blob, sha256Text, stableStringify } from "./utils";
import { getAssetRuntime } from "../assets/assetRuntimeRegistry";

function exportProject(state) {
    return {
        kind: "HMIEditorProject",
        schemaVersion: SCHEMA_VERSION,
        projectId: state.meta.projectId,
        projectName: state.projectName,
        activePageId: state.activePageId,
        pageIdWithThumb: state.pageIdWithThumb,
        pages: state.pages,
        nodes: state.nodes,
        assets: state.assets,
        assetHashIndex: state.assetHashIndex,
    };
}

function collectUsedAssetIds(nodes) {
    const out = new Set();
    for (const id in nodes) {
        const n = nodes[id];
        if (n?.type === SHAPES.image && n.assetId) out.add(n.assetId);
    }
    return [...out];
}

/**
 * @param {{ state: any, tools?: any }} args
 * @returns {Promise<{ blob: Blob, manifest: any }>}
 */
export async function buildProjectPackage({ state, tools }) {
    const zip = new JSZip();
    const project = exportProject(state);
    const thumbPageId = project.pageIdWithThumb ?? project.activePageId;

    // 1) project.json bytes/hash
    const projectJson = JSON.stringify(project, null, 2);
    const projectSha = await sha256Text(projectJson);

    // 2) thumbnail
    let thumbBlob = null;
    try {
        const nodesLayer = tools?.api?.getNodesLayer?.();
        const nodesRef = tools?.nodesRef;
        if (nodesLayer && nodesRef) {
            thumbBlob = await renderPageToBlobOffscreen({
                state,
                pageId: thumbPageId,
            });
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

    const usedAssetIds = collectUsedAssetIds(project.nodes);
    const assetFiles = [];

    for (const id of usedAssetIds) {
        const meta = project.assets?.[id];
        if (!meta) continue;

        const runtime = getAssetRuntime(id);
        const blob = runtime?.blob;
        if (!blob) {
            console.warn("[export] asset blob missing:", id);
            continue;
        }

        const sha = await sha256Blob(blob);
        const bytes = blob.size;
        const path = `assets/${id}.${meta.ext || "bin"}`;

        assetFiles.push({
            path,
            mime: meta.mimeType,
            bytes,
            sha256: sha,
            id,
        });

        zip.file(path, blob, { compression: "STORE" });
    }

    files.push(...assetFiles);

    const manifest = {
        format: "tir-project",
        formatVersion: 1,
        schemaVersion: SCHEMA_VERSION,
        projectId: project.projectId,
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
