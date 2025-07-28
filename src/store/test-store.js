//import config from "@/config/instance.json";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createContextMenu } from "@/utils/createContextMenu";
import { testConfig } from "@/config/testConfig";

function addSettings(node) {
    return {
        ...node,
        settings: {
            ...node.settings,
            description: {
                type: "textarea",
                label: "Описание",
            },
            variable: {
                type: "drop",
                label: "Переменная",
            },
        },
    };
}

function collectNodePaths(data, parentPath = "#", map = {}) {
    if (!Array.isArray(data)) return map;
    data.forEach((element) => {
        let newElement = element;
        if (element.type === "dataObject") {
            newElement = addSettings(element);
        }
        const path = `${parentPath}/${element.node}`;
        map[path] = newElement;
        collectNodePaths(newElement.children, path, map);
    });
    return map;
}

const nodePaths = collectNodePaths(testConfig);
console.log("nodePaths", nodePaths);

const initialState = {
    nodePaths: nodePaths,
    contextMenu: createContextMenu(testConfig, nodePaths),
};

export const useTestStore = create(
    devtools(
        (set) => ({
            ...initialState,
            setData: (data) =>
                set(
                    () => ({
                        stateData: data,
                        nodePaths: collectNodePaths(data),
                    }),
                    undefined,
                    "setData"
                ),
        }),
        { name: "test-store" }
    )
);
