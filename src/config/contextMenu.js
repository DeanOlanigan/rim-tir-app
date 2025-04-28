import { createElement } from "react";
import { deleteNode as deleteNodeUtil } from "../utils/utils";
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
    LuAnchor,
    LuBan,
} from "react-icons/lu";
import { useVariablesStore } from "../store/variables-store";

const renameNode = {
    type: "rename-node",
    icon: () => createElement(LuPencil),
    label: "Переименовать",
    action: (treeApi) => treeApi.edit(treeApi.focusedNode),
};
const deleteNode = {
    type: "delete-node",
    icon: () => createElement(LuTrash2),
    label: "Удалить",
    style: {
        color: "fg.error",
        _hover: { bg: "bg.error", color: "fg.error" },
    },
    action: (treeApi) => deleteNodeUtil(treeApi),
};
const createNode = (label, action, icon) => ({
    type: `create-${action}`,
    label,
    icon: () => createElement(icon),
    action: (treeApi) => treeApi.create({ type: action }),
});

const ignoreNode = {
    type: "change-ignore",
    action: (treeApi) => {
        const ignoreNode = useVariablesStore.getState().ignoreNode;
        ignoreNode(treeApi);
    },
};

export const menuConfigNodeDefault = [renameNode, deleteNode, ignoreNode];

export const menuConfigConnections = {
    rs232: [
        createNode("Создать Modbus-RTU...", "modbus-rtu", LuUnplug),
        ...menuConfigNodeDefault,
    ],
    rs485: [
        createNode("Создать Modbus-RTU...", "modbus-rtu", LuUnplug),
        ...menuConfigNodeDefault,
    ],
    comport: [
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
    dataObject: [
        {
            type: "rename-node",
            icon: () => createElement(LuPencil),
            label: "Перепривязать переменную",
            action: (treeApi) => treeApi.edit(treeApi.focusedNode),
        },
        deleteNode,
        ignoreNode,
    ],
    default: [
        /* createNode("Создать RS-485...", "rs485", LuCable),
        createNode("Создать RS-232...", "rs232", LuCable), */
        createNode("Последовательный порт...", "comport", LuAnchor),
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
