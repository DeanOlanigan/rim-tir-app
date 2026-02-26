import { toaster } from "@/components/ui/toaster";
import { useNodeStore } from "../store/node-store";
import { normalizeProjectTree } from "./normalizeProjectTree";
import { validateProjectStructure } from "./projectSchema";
import { putAssetRuntime } from "../assets/assetRuntimeRegistry";

export const applyProjectData = (rawProjectData, mode, filename, files) => {
    const validation = validateProjectStructure(rawProjectData);
    if (!validation.ok) throw new Error(validation.errors.join(", "));

    const normalized = normalizeProjectTree(validation.value, {
        pruneOrphans: true,
        onIssue: (i) => {
            toaster.create({
                type: "error",
                title: "Произошла ошибка",
                description: i.message,
            });
        },
    });

    restoreAssetRuntimeRegistryFromFiles(normalized, files, (msg) => {
        console.warn("[assets]", msg);
    });

    const store = useNodeStore.getState();
    store.open(normalized, mode, filename);

    useNodeStore.temporal.getState().clear();
};

export function restoreAssetRuntimeRegistryFromFiles(project, files, onWarn) {
    const assets = project?.assets;
    if (!assets || !files) return;

    for (const assetId of Object.keys(assets)) {
        const meta = assets[assetId];
        const path = meta?.storageKey;
        if (!path) continue;

        const rec = files.get(path);
        const blob = rec?.blob;

        if (!blob) {
            onWarn?.(`Asset blob not found: ${assetId} (${path})`);
            continue;
        }

        putAssetRuntime(assetId, blob);
    }
}
