import { useVariablesStore } from "@/store/variables-store";
import { deleteNodeUtil, getParentId } from "../treeUtils";

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
    edit: {
        type: "edit",
        icon: { name: "pencil" },
        label: "Редактировать",
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
            const ids = getSelectedIds(treeApi);
            useVariablesStore.getState().toggleIgnore(ids);
        },
    },
    copy: {
        type: "copy",
        icon: { name: "copy" },
        label: "Копировать",
        action: (treeApi) => {
            const ids = getSelectedIds(treeApi);
            const treeType = treeApi.props.treeType;
            useVariablesStore.getState().copyNode(treeType, ids);
        },
    },
    cut: {
        type: "cut",
        icon: { name: "scissors" },
        label: "Вырезать",
        action: (treeApi) => {
            const ids = getSelectedIds(treeApi);
            const treeType = treeApi.props.treeType;
            useVariablesStore.getState().cutNode(treeType, ids);
        },
    },
    paste: {
        type: "paste",
        icon: { name: "paste" },
        label: "Вставить",
        action: (treeApi) => {
            const treeType = treeApi.props.treeType;
            const parentId = getParentId(treeApi);
            useVariablesStore.getState().pasteNode(treeType, parentId);
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
    "#/variable": [actions.rename, ...menuConfigNodeDefault],
    "#/folder": [
        makeCreateMenu({
            label: "Создать папку",
            nodeType: "folder",
            icon: { name: "folder" },
            basePath: "#/folder",
        }),
        nestedVariables,
        { type: "separator" },
        actions.rename,
        ...menuConfigNodeDefault,
        actions.paste,
    ],
};
