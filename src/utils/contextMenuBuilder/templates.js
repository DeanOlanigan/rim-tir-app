import { useVariablesStore } from "@/store/variables-store";
import {
    deleteNodeUtil,
    getIdsSetWithoutNested,
} from "@/utils/treeUtils/treeUtils";

function getSelectedIds(treeApi) {
    if (treeApi.selectedIds.size > 1) return [...treeApi.selectedIds];
    if (treeApi.focusedNode) return [treeApi.focusedNode.data.id];
    return [];
}

export const actions = {
    rename: {
        type: "rename",
        icon: { name: "pencil" },
        label: "Переименовать",
        action: (treeApi) => treeApi.edit(treeApi.focusedNode),
    },
    delete: {
        type: "delete",
        icon: { color: "fg.error", name: "trash" },
        label: "Удалить",
        style: {
            color: "fg.error",
            _hover: { bg: "bg.error", color: "fg.error" },
        },
        action: (treeApi) => deleteNodeUtil(treeApi),
    },
    toggleIgnore: {
        type: "ignore",
        action: (treeApi) => {
            const ignoreNodeFunc = useVariablesStore.getState().ignoreNode;
            const ids = getSelectedIds(treeApi);
            const ignore = !treeApi.focusedNode.data.isIgnored;
            ignoreNodeFunc(treeApi, ids, ignore);
        },
    },
    copy: {
        type: "copy",
        icon: { name: "copy" },
        label: "Копировать",
        action: (treeApi) => {
            const copyNode = useVariablesStore.getState().copyNode;
            const ids = getSelectedIds(treeApi);
            copyNode(treeApi, ids);
        },
    },
    cut: {
        type: "cut",
        icon: { name: "scissors" },
        label: "Вырезать",
        action: (treeApi) => {
            const baseIds = treeApi.root.children.map((child) => child.id);
            const cutNodeFunc = useVariablesStore.getState().cutNode;
            const copyNode = useVariablesStore.getState().copyNode;
            const ids = getSelectedIds(treeApi);
            cutNodeFunc(treeApi, baseIds, false);
            copyNode(treeApi, ids, true);
            cutNodeFunc(treeApi, ids, true);
        },
    },
    paste: {
        type: "paste",
        icon: { name: "paste" },
        label: "Вставить",
        action: (treeApi) => {
            const pasteNode = useVariablesStore.getState().pasteNode;
            const removeNode = useVariablesStore.getState().removeNode;
            const { cut, normalized } = useVariablesStore.getState().copyBuffer;
            const ids = Object.keys(normalized);
            const treeType = treeApi.props.treeType;
            const [...clearIds] = getIdsSetWithoutNested(treeApi, ids);
            console.log("isCut", cut, clearIds);
            cut && removeNode(treeType, clearIds);
            pasteNode(treeApi);
        },
    },
};

export function makeCreateMenu({
    label,
    nodeType,
    countPresets = [1],
    basePath,
    icon = {},
}) {
    const iconDef = { color: icon?.color, name: icon.name || "plus" };
    if (countPresets.length > 1) {
        return {
            type: "submenu",
            icon: iconDef,
            label,
            children: countPresets.map((count) => ({
                type: "create",
                node: nodeType,
                count,
                path: basePath,
                label: `${label} (${count})`,
                icon: iconDef,
                action: (treeApi) =>
                    treeApi.create({
                        type: { nodeType, times: count, path: basePath },
                    }),
            })),
        };
    }
    return {
        type: "create",
        node: nodeType,
        count: 1,
        path: basePath,
        label,
        icon: iconDef,
        action: (treeApi) =>
            treeApi.create({ type: { nodeType, times: 1, path: basePath } }),
    };
}

const nestedVariables = makeCreateMenu({
    label: "Создать переменную",
    nodeType: "variable",
    countPresets: [1, 2, 3, 5, 10],
    basePath: "#/variable",
    icon: { name: "variable" },
});

export const menuConfigNodeDefault = [
    { type: "separator" },
    actions.rename,
    actions.delete,
    actions.toggleIgnore,
    { type: "separator" },
    actions.cut,
    actions.copy,
];

export const variablesPathConfig = {
    "#": [
        makeCreateMenu({
            label: "Создать папку",
            nodeType: "folder",
            icon: { name: "folder" },
            basePath: "#/folder",
        }),
        nestedVariables,
        actions.paste,
    ],
    "#/variable": menuConfigNodeDefault.slice(1),
    "#/folder": [
        makeCreateMenu({
            label: "Создать папку",
            nodeType: "folder",
            icon: { name: "folder" },
            basePath: "#/folder",
        }),
        nestedVariables,
        ...menuConfigNodeDefault,
        actions.paste,
    ],
};

export const dispatchAction = {
    create: (params) =>
        params.treeApi.create({
            type: {
                nodeType: params.node,
                times: params.count,
                path: params.path,
            },
        }),
    delete: (params) => deleteNodeUtil(params.treeApi),
    ignore: (params) => {
        const ignoreNodeFunc = useVariablesStore.getState().ignoreNode;
        const ids = getSelectedIds(params.treeApi);
        const ignore = !params.treeApi.focusedNode.data.isIgnored;
        ignoreNodeFunc(params.treeApi, ids, ignore);
    },
    rename: (params) => params.treeApi.edit(params.treeApi.focusedNode),
    copy: (params) => {
        const copyNode = useVariablesStore.getState().copyNode;
        const ids = getSelectedIds(params.treeApi);
        copyNode(params.treeApi, ids);
    },
    cut: (params) => {
        const baseIds = params.treeApi.root.children.map((child) => child.id);
        const cutNodeFunc = useVariablesStore.getState().cutNode;
        const copyNode = useVariablesStore.getState().copyNode;
        const ids = getSelectedIds(params.treeApi);
        cutNodeFunc(params.treeApi, baseIds, false);
        copyNode(params.treeApi, ids, true);
        cutNodeFunc(params.treeApi, ids, true);
    },
    paste: (params) => {
        const pasteNode = useVariablesStore.getState().pasteNode;
        const removeNode = useVariablesStore.getState().removeNode;
        const { cut, normalized } = useVariablesStore.getState().copyBuffer;
        const ids = Object.keys(normalized);
        const treeType = params.treeApi.props.treeType;
        const [...clearIds] = getIdsSetWithoutNested(params.treeApi, ids);
        console.log("isCut", cut, clearIds);
        cut && removeNode(treeType, clearIds);
        pasteNode(params.treeApi);
    },
};
