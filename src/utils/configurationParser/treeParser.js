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
        rules: [
            {
                validator: "required",
                message: "Это поле обязательно для заполнения",
            },
        ],
    };
}

export function parseTree(data) {
    data.push(variable);
    const { nodePaths, settingPaths, visiblePaths } =
        transformConfiguration(data);
    nodePaths["#"] = {
        node: "#",
        type: "root",
        icon: { name: "listTree" },
    };
    return { nodePaths, settingPaths, visiblePaths };
}

function transformConfiguration(
    data,
    parentPath = "#",
    nodePaths = {},
    settingPaths = {},
    visiblePaths = {},
    parent = null
) {
    if (!Array.isArray(data)) return { nodePaths, settingPaths, visiblePaths };
    data.forEach((element) => {
        const path = `${parentPath}/${element.node}`;
        element.parentPath = parentPath;
        element.parent = parent;
        if (element.type === "dataObject") {
            addSettings(element);
        }
        if (element.settings) {
            settingsTraverse(element, path, settingPaths, visiblePaths);
        }
        nodePaths[path] = element;
        transformConfiguration(
            element.children,
            path,
            nodePaths,
            settingPaths,
            visiblePaths,
            element
        );
    });
    return { nodePaths, settingPaths, visiblePaths };
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
