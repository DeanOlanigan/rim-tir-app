import { settingsTraverse } from "./settingsParser";
import { variable } from "@/config/variableTemplate";

function addSettings(node) {
    node.settings.description = {
        type: "textarea",
        label: "Описание",
        default: "",
    };
    node.settings.variableId = {
        type: "drop",
        label: "Переменная",
        default: "",
    };
}

export function parseTree(data) {
    const { nodePaths, settingPaths } = transformConfiguration(data);
    nodePaths["#/variable"] = variable;
    nodePaths["#"] = {
        node: "#",
        type: "root",
        icon: { name: "listTree" },
    };
    return { nodePaths, settingPaths };
}

function transformConfiguration(
    data,
    parentPath = "#",
    nodePaths = {},
    settingPaths = {},
    parent = null
) {
    if (!Array.isArray(data)) return { nodePaths, settingPaths };
    data.forEach((element) => {
        const path = `${parentPath}/${element.node}`;
        element.parentPath = parentPath;
        element.parent = parent;
        if (element.type === "dataObject") {
            addSettings(element);
        }
        if (element.settings) {
            settingsTraverse(element, path, settingPaths);
        }
        nodePaths[path] = element;
        transformConfiguration(
            element.children,
            path,
            nodePaths,
            settingPaths,
            element
        );
    });
    return { nodePaths, settingPaths };
}

export function buildDependenciesGraph(map) {
    const graph = {};
    for (const [paramPath, deps] of Object.entries(map)) {
        for (const dep of deps) {
            if (!graph[dep.path]) graph[dep.path] = new Set();
            graph[dep.path].add(paramPath);
        }
    }
    return graph;
}
