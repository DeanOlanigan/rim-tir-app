import { nanoid } from "nanoid";
import { configuratorConfig } from "./configurationParser";

export const getStartDate = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 3);
    startDate.setMinutes(Math.round(startDate.getMinutes() / 15) * 15);
    return startDate.getTime();
};

export const getEndDate = () => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate());
    endDate.setMinutes(Math.round(endDate.getMinutes() / 15) * 15);
    return endDate.getTime();
};

export function getRandomColor() {
    return (
        // eslint-disable-next-line
        "#" + (Math.random().toString(16) + "000000").slice(2, 8).toUpperCase()
    );
}

export function getParentType({ id, treeApi, checkNode }) {
    if (!checkNode) checkNode = treeApi.get(id);
    const recursive = (node) => {
        if (node.data.type === "folder" || node.data.type === "dataObject")
            return recursive(node.parent);
        return node.data.path;
    };
    return recursive(checkNode);
}

export function getMeaningNode(id, settings) {
    function recursive(id) {
        const node = settings[settings[id].parentId];
        if (!node) return undefined;

        if (node.type === "folder" || node.type === "dataObject") {
            return recursive(node.id);
        } else {
            return node;
        }
    }
    return recursive(id);
}

export function initDefaultDataByPath(path, parentId) {
    const nodePaths = configuratorConfig.nodePaths;
    const id = nanoid(12);
    const node = {
        id: id,
        node: nodePaths[path].node,
        type: nodePaths[path].type,
        name: nodePaths[path].label,
        path: path,
        isIgnored: false,
        isCutted: false,
    };
    if (nodePaths[path].children || nodePaths[path].type === "folder") {
        node.children = [];
    }
    const setting = {
        ...node,
        parentId,
    };
    setting.setting = {};
    if (nodePaths[path].settings)
        Object.entries(nodePaths[path].settings).map(
            ([key, value]) => (setting.setting[key] = value.default)
        );
    return { node: node, setting, name: node.name };
}

// MOSTLY DEPRECATED
export function initCardsData(data) {
    const cardsData = {};

    // Показывать isSpecial, если type === "bit"
    if (data.type === "bit") {
        cardsData.isSpecial = {
            checked: data.isSpecial,
            parameters: [
                {
                    key: "specialCycleDelay",
                    value: data.specialCycleDelay,
                },
            ],
        };
    }

    // Показывать cmd и archive, если type === "bit" или "twoByteUnsigned"
    if (data.type === "bit" || data.type === "twoByteUnsigned") {
        cardsData.cmd = {
            checked: data.cmd,
            parameters: [],
        };
        cardsData.archive = {
            checked: data.archive,
            parameters: [
                {
                    key: "group",
                    value: data.group,
                },
            ],
        };
    }

    // Показывать graph, если type !== "bit"
    if (data.type !== "bit") {
        cardsData.graph = {
            checked: data.graph,
            parameters: [
                { key: "aperture", value: data.aperture },
                { key: "measurement", value: data.measurement },
            ],
        };
    }

    return cardsData;
}

// MOSTLY DEPRECATED
export function getUniqueName(nodes, name, ignoreId = null) {
    const usedNames = new Set();
    function recursive(nodes) {
        if (!Array.isArray(nodes)) return;
        for (const node of nodes) {
            if (node.id !== ignoreId)
                usedNames.add(node.name || node.data.name);
            if (node.children?.length > 0) recursive(node.children);
        }
    }
    recursive(nodes);

    if (!usedNames.has(name)) {
        return name;
    }
    let copyCount = 1;
    while (true) {
        const copyName = `${name} (${copyCount})`;
        if (!usedNames.has(copyName)) {
            return copyName;
        }
        copyCount++;
    }
}

// DEPRECATED
export function combineRefs(...refs) {
    return (node) => {
        for (const ref of refs) {
            ref.current = node;
        }
    };
}
