export const actions = {
    rename: {
        type: "rename",
        icon: { name: "pencil" },
        label: "Переименовать",
        action: "edit",
    },
    edit: {
        type: "edit",
        icon: { name: "pencil" },
        label: "Редактировать",
        action: "edit",
    },
    delete: {
        type: "delete",
        icon: { color: "fg.error", name: "trash" },
        label: "Удалить",
        style: {
            color: "fg.error",
            _hover: { bg: "bg.error", color: "fg.error" },
        },
        action: "delete",
    },
    toggleIgnore: {
        type: "ignore",
        action: "toggleIgnore",
    },
    copy: {
        type: "copy",
        icon: { name: "copy" },
        label: "Копировать",
        action: "copy",
    },
    cut: {
        type: "cut",
        icon: { name: "scissors" },
        label: "Вырезать",
        action: "cut",
    },
    paste: {
        type: "paste",
        icon: { name: "paste" },
        label: "Вставить",
        action: "paste",
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
                action: "create",
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
        action: "create",
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
