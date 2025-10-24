import { configuratorConfig } from "@/store/configurator-config";
import { buildDependenciesGraph, parseTree } from "./treeParser";
import { resolveFind } from "./logicDependency";

let _built = false;
let _promise = null;

export async function ensureConfiguratorConfig() {
    if (_built) return configuratorConfig;
    if (_promise) return _promise;

    _promise = (async () => {
        const [{ config }, { createContextMenu }] = await Promise.all([
            import("@/config/generated/generatedConfig"),
            import("../contextMenuBuilder/builder"),
        ]);

        const { nodePaths, settingPaths, visiblePaths } = parseTree(config);
        resolveFind(nodePaths, settingPaths);
        resolveFind(nodePaths, visiblePaths);
        const graph = buildDependenciesGraph(settingPaths);
        const vgraph = buildDependenciesGraph(visiblePaths);
        const contextMenu = createContextMenu(config, nodePaths);

        Object.assign(configuratorConfig, {
            nodePaths,
            contextMenu,
            graph,
            vgraph,
        });
        _built = true;
        return configuratorConfig;
    })();

    return _promise;
}
