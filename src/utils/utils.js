import { v4 as uuidv4 } from "uuid";
import {
    DEFAULT_CONFIGURATION_DATA,
    DEFAULT_DATA_OBJECT_SETTING,
    CONSTANT_VALUES,
} from "../config/constants";

const startDate = new Date();
startDate.setDate(startDate.getDate() - 3);
startDate.setMinutes(Math.round(startDate.getMinutes() / 15) * 15);

export const getStartDate = () => startDate.getTime();

const endDate = new Date();
endDate.setDate(endDate.getDate());
endDate.setMinutes(Math.round(endDate.getMinutes() / 15) * 15);

export const getEndDate = () => endDate.getTime();

export function getRandomColor() {
    return (
        "#" + (Math.random().toString(16) + "000000").slice(2, 8).toUpperCase()
    );
}

export function normalizeData(data, result = {}, parentId = null) {
    data.forEach((element) => {
        const id = uuidv4();
        result[id] = { ...element, id, parentId };

        if (element.children) {
            result[id].children = element.children.map((child) => {
                const childId = uuidv4();
                normalizeData([child], result, childId);
                return childId;
            });
        }
    });
    return result;
}

//console.log("Normalized:", normalizeData(config.children[2].children));

export function separateData(data, treeData = [], nodeData = {}) {
    data.forEach((element) => {
        const { setting, children, ...rest } = element;
        nodeData[element.id] = { id: element.id, ...setting };
        if (children) {
            const newNode = { ...rest, children: [] };
            separateData(children, newNode.children, nodeData);
            treeData.push(newNode);
        } else {
            treeData.push(rest);
        }
    });
    return { treeData, nodeData };
}

//console.log("Separated:", separateData(config.children[2].children));

export function separateDataNEW(data, nodeData = {}, parentId = null) {
    if (!data) {
        return { treeData: null, nodeData };
    }

    const { setting, children, ...rest } = data;

    nodeData[data.id] = {
        id: data.id,
        parentId,
        name: data.name,
        setting,
        ...rest,
    };

    const treeData = {
        id: data.id,
        name: data.name,
        type: data.type,
    };

    if (data.subType) treeData.subType = data.subType;

    if (Array.isArray(children)) {
        treeData.children = [];
        nodeData[data.id].children = [];
        for (const child of children) {
            const { treeData: childNested } = separateDataNEW(
                child,
                nodeData,
                data.id
            );
            if (childNested) {
                treeData.children.push(childNested);
                nodeData[data.id].children.push(child.id);
            }
        }
    }

    return { treeData, nodeData };
}

export function separateTree(data) {
    const { children, ...rest } = data;
    const configurationInfo = rest;
    const trees = {};
    for (const child of children) {
        trees[child.type] = child.children;
    }
    return { trees, configurationInfo };
}

//console.log("SEPARATED NEW", separateDataNEW(config));

export function getParentType({ id, treeApi, checkNode }) {
    if (!checkNode) checkNode = treeApi.get(id);
    const recursive = (node) => {
        if (node.data.type === "folder" || node.data.type === "dataObject")
            return recursive(node.parent);
        return node.data.type;
    };
    return recursive(checkNode);
}

export function getParentTypeNormalized({ data, id }) {
    if (!id) return null;
    const recursive = (id) => {
        if (!id) return "root";
        if (data[id].type === "folder" || data[id].type === "dataObject")
            return recursive(data[id].parentId);
        return data[id].type === "interface" || data[id].type === "protocol"
            ? data[id].subType
            : data[id].type;
    };
    return recursive(data[id]?.parentId);
}

export function initDefaultData(type, parentId, treeApi) {
    const id = uuidv4();
    const node = {
        id: id,
        ...DEFAULT_CONFIGURATION_DATA[type].node,
    };
    const setting = {
        id: id,
        parentId,
        ...DEFAULT_CONFIGURATION_DATA[type].setting,
    };
    if (type === CONSTANT_VALUES.NODE_TYPES.dataObject) {
        const parentType = getParentType({
            id: parentId,
            treeApi: treeApi,
        });
        setting.setting = DEFAULT_DATA_OBJECT_SETTING[parentType];
    }
    return { node, setting, name: node.name };
}

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

export function checkDependsOn(data, dependsOn, settings) {
    const conditions = Array.isArray(dependsOn) ? dependsOn : [dependsOn];

    const checkCondition = (cond, node) => {
        if (cond.scope === "self") {
            return node.setting?.[cond.key] === cond.value;
        } else {
            const checkParent = (current) => {
                if (!current) return false;
                if (current.setting?.[cond.key] === cond.value) return true;
                return checkParent(settings[current.parentId]);
            };
            return checkParent(node);
        }
    };
    return conditions.every((cond) => checkCondition(cond, data));
}

export function checkDependsOn2(data, dependsOn, settings) {
    const evaluate = (cond, node) => {
        if ("type" in cond && Array.isArray(cond.conditions)) {
            const results = cond.conditions.map((c) => evaluate(c, node));
            return cond.type === "and"
                ? results.every(Boolean)
                : results.some(Boolean);
        }

        const { key, value, scope } = cond;
        if (scope === "self") {
            return node.setting?.[key] === value;
        }

        const checkParent = (current) => {
            if (!current) return false;
            if (current.setting?.[key] === value) return true;
            return checkParent(settings[current.parentId]);
        };
        return checkParent(settings[node.parentId]);
    };

    return evaluate(dependsOn, data);
}

export function resolveDynProps(data, rules = [], settings) {
    for (const rule of rules) {
        if (!rule.condition) return rule.props;

        if (checkDependsOn2(data, rule.condition, settings)) {
            return rule.props;
        }
    }

    return {};
}

export function deleteNode(treeApi) {
    if (!treeApi.props.onDelete) return;
    const ids = Array.from(treeApi.selectedIds);
    if (ids.length > 1) {
        let nextFocus = treeApi.mostRecentNode;
        while (nextFocus && nextFocus.isSelected) {
            nextFocus = nextFocus.nextSibling;
        }
        if (!nextFocus) nextFocus = treeApi.lastNode;
        treeApi.focus(nextFocus, { scroll: false });
        treeApi.delete(Array.from(ids));
    } else {
        const node = treeApi.focusedNode;
        if (node) {
            const sib = node.nextSibling;
            const parent = node.parent;
            treeApi.focus(sib || parent, { scroll: false });
            treeApi.delete(node);
        }
    }
}
