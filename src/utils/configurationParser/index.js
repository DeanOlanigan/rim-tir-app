import { testConfig } from "@/config/testConfig";
import { resolveFind } from "./logicDependency";
import { buildDependenciesGraph, parseTree } from "./treeParser";
import { createContextMenu } from "../contextMenuBuilder";

const { nodePaths, settingPaths } = parseTree(testConfig);

resolveFind(nodePaths, settingPaths);
const graph = buildDependenciesGraph(settingPaths);

const contextMenu = createContextMenu(testConfig, nodePaths);

console.log("nodePaths", nodePaths, Object.keys(nodePaths).length);
console.log("settingPaths", settingPaths, Object.keys(settingPaths).length);
console.log("graph", graph, Object.keys(graph).length);
//console.log("Контекстное меню", contextMenu);

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

export const configuratorConfig = {
    nodePaths: nodePaths,
    contextMenu: contextMenu,
    graph: graph,
};
