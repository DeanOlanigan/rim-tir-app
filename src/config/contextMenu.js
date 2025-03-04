import { createElement } from "react";
import {
    LuFolder,
    LuVariable,
    LuPencil,
    LuTrash2,
    LuUnplug,
    LuCable,
} from "react-icons/lu";

export const menuConfigNodeDefault = [
    {
        key: "renameVariable",
        icon: () => createElement(LuPencil),
        label: "Переименовать",
        action: (treeApi) => treeApi.edit(treeApi.focusedNode),
    },
    {
        key: "deleteVariable",
        icon: () => createElement(LuTrash2),
        label: "Удалить",
        style: {
            color: "fg.error",
            _hover: { bg: "bg.error", color: "fg.error" },
        },
        action: (treeApi) => treeApi.delete([...treeApi.selectedIds]),
    },
];

export const menuConfigConnections = {
    protocol: [
        {
            key: "createModbusRtu",
            label: "Создать Modbus-RTU...",
            icon: () => createElement(LuUnplug),
            action: (treeApi) => treeApi.create({ type: "mobdusrtu" }),
        },
    ],
    default: [
        {
            key: "createRs485",
            label: "Создать RS-485...",
            icon: () => createElement(LuCable),
            action: (treeApi) => treeApi.create({ type: "rs485" }),
        },
        {
            key: "createRs232",
            label: "Создать RS-232...",
            icon: () => createElement(LuCable),
            action: (treeApi) => treeApi.create({ type: "rs232" }),
        },
        {
            key: "createIec104",
            label: "Создать IEC-104...",
            icon: () => createElement(LuUnplug),
            action: (treeApi) => treeApi.create({ type: "iec104" }),
        },
        {
            key: "createGPIO",
            label: "Создать GPIO...",
            icon: () => createElement(LuCable),
            action: (treeApi) => treeApi.create({ type: "gpio" }),
        },
    ],
};

export const menuConfig = {
    variables: {
        variable: [...menuConfigNodeDefault],
        folder: [
            {
                key: "createVariable",
                icon: () => createElement(LuVariable),
                label: "Создать переменную...",
                action: (treeApi) => treeApi.create({ type: "variable" }),
            },
            { type: "separator" },
            ...menuConfigNodeDefault,
        ],
        default: [
            {
                key: "createVariable",
                icon: () => createElement(LuVariable),
                label: "Создать переменную...",
                action: (treeApi) => treeApi.create({ type: "variable" }),
            },
            {
                key: "createFolder",
                icon: () => createElement(LuFolder),
                label: "Создать папку...",
                action: (treeApi) => treeApi.create({ type: "folder" }),
            },
        ],
    },
    send: menuConfigConnections,
    receive: menuConfigConnections,
};
