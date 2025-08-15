/* import { config } from "@/config/generated/generatedConfig";
import { resolveFind } from "./logicDependency";
import { buildDependenciesGraph, parseTree } from "./treeParser";
import { createContextMenu } from "../contextMenuBuilder";

const t0 = performance.now();
const { nodePaths, settingPaths } = parseTree(config);
const t1 = performance.now();

const t01 = performance.now();
resolveFind(nodePaths, settingPaths);
const graph = buildDependenciesGraph(settingPaths);
const t11 = performance.now();

const t20 = performance.now();
const contextMenu = createContextMenu(config, nodePaths);
const t21 = performance.now();

console.log("parseTree:", t1 - t0);
//console.log("nodePaths", nodePaths, Object.keys(nodePaths).length);
//console.log("settingPaths", settingPaths, Object.keys(settingPaths).length);

console.log("graph functions:", t11 - t01);
//console.log("graph", graph, Object.keys(graph).length);

console.log("contextMenu functions:", t21 - t20);
//console.log("Контекстное меню", contextMenu);

export const configuratorConfig = {
    nodePaths: nodePaths,
    contextMenu: contextMenu,
    graph: graph,
}; */

/* let _cache = {};
export const configuratorConfig = {
    get nodePaths() {
        if (!_cache.nodePaths) _cache.nodePaths = nodePaths;
        return _cache.nodePaths;
    },
    get contextMenu() {
        if (!_cache.contextMenu) _cache.contextMenu = contextMenu;
        return _cache.contextMenu;
    },
    get graph() {
        if (!_cache.graph) _cache.graph = graph;
        return _cache.graph;
    },
}; */

let _built = false;
let _promise = null;

export const configuratorConfig = {};

export async function ensureConfiguratorConfig() {
    if (_built) return configuratorConfig;
    if (_promise) return _promise;

    _promise = (async () => {
        const [
            { config },
            { resolveFind },
            { buildDependenciesGraph, parseTree },
            { createContextMenu },
        ] = await Promise.all([
            import("@/config/generated/generatedConfig"),
            import("./logicDependency"),
            import("./treeParser"),
            import("../contextMenuBuilder/builder"),
        ]);

        const { nodePaths, settingPaths } = parseTree(config);
        resolveFind(nodePaths, settingPaths);
        const graph = buildDependenciesGraph(settingPaths);
        const contextMenu = createContextMenu(config, nodePaths);

        Object.assign(configuratorConfig, { nodePaths, contextMenu, graph });
        _built = true;
        return configuratorConfig;
    })();

    return _promise;
}
