import { createElement } from "react";
import {
    LuFolder,
    LuVariable,
    LuPencil,
    LuTrash2,
    LuUnplug,
    LuCable,
    LuFileDigit,
    LuFileStack,
    LuPackage,
} from "react-icons/lu";

const renameNode = {
    key: "rename-node",
    icon: () => createElement(LuPencil),
    label: "Переименовать",
    action: (treeApi) => treeApi.edit(treeApi.focusedNode),
};
const deleteNode = {
    key: "delete-node",
    icon: () => createElement(LuTrash2),
    label: "Удалить",
    style: {
        color: "fg.error",
        _hover: { bg: "bg.error", color: "fg.error" },
    },
    action: (treeApi) => treeApi.delete([...treeApi.selectedIds]),
};
const createNode = (label, action, icon) => ({
    key: `create-${action}`,
    label,
    icon: () => createElement(icon),
    action: (treeApi) => treeApi.create({ type: action }),
});

export const menuConfigNodeDefault = [renameNode, deleteNode];

export const menuConfigConnections = {
    rs232: [
        createNode("Создать Modbus-RTU...", "modbus-rtu", LuUnplug),
        ...menuConfigNodeDefault,
    ],
    rs485: [
        createNode("Создать Modbus-RTU...", "modbus-rtu", LuUnplug),
        ...menuConfigNodeDefault,
    ],
    iec104: [
        createNode("Создать ASDU...", "asdu", LuFileStack),
        ...menuConfigNodeDefault,
    ],
    asdu: [
        createNode("Создать объект данных...", "dataObject", LuFileDigit),
        createNode("Создать папку...", "folder", LuFolder),
        ...menuConfigNodeDefault,
    ],
    "modbus-rtu": [
        createNode("Создать группу функций...", "functionGroup", LuPackage),
        ...menuConfigNodeDefault,
    ],
    functionGroup: [
        createNode("Создать объект данных...", "dataObject", LuFileDigit),
        ...menuConfigNodeDefault,
    ],
    gpio: [
        //createNode("Создать объект данных...", "dataObject", LuFileDigit),
        createNode("Создать папку...", "folder", LuFolder),
        ...menuConfigNodeDefault,
    ],
    folder: [
        createNode("Создать объект данных...", "dataObject", LuFileDigit),
        ...menuConfigNodeDefault,
    ],
    dataObject: [deleteNode],
    default: [
        createNode("Создать RS-485...", "rs485", LuCable),
        createNode("Создать RS-232...", "rs232", LuCable),
        createNode("Создать IEC-104...", "iec104", LuUnplug),
        createNode("Создать GPIO...", "gpio", LuCable),
    ],
};

export const menuConfig = {
    variables: {
        variable: [...menuConfigNodeDefault],
        folder: [
            createNode("Создать переменную...", "variable", LuVariable),
            { type: "separator" },
            ...menuConfigNodeDefault,
        ],
        default: [
            createNode("Создать переменную...", "variable", LuVariable),
            createNode("Создать папку...", "folder", LuFolder),
        ],
    },
    send: menuConfigConnections,
    receive: menuConfigConnections,
};
