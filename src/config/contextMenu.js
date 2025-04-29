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
const createNode = (label, action, icon, times = 1) => ({
    type: `create-${action}-${times}`,
    label,
    icon: () => createElement(icon),
    action: (treeApi) => {
        treeApi.create({ type: { nodeType: action, times } });
    },
});

const toggleIgnoreNode = {
    type: "change-ignore",
    action: (treeApi) => {
        const ignoreNodeFunc = useVariablesStore.getState().ignoreNode;
        const ids =
            treeApi.selectedIds.size > 1
                ? [...treeApi.selectedIds]
                : treeApi.focusedNode
                ? [treeApi.focusedNode.data.id]
                : [];
        const ignore = !treeApi.focusedNode.data.isIgnored;
        ignoreNodeFunc(treeApi, ids, ignore);
    },
};

export const menuConfigNodeDefault = [renameNode, deleteNode, toggleIgnoreNode];

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
        createNode(
            "Создать объект данных... (5)",
            "dataObject",
            LuFileDigit,
            5
        ),
        createNode("Создать папку...", "folder", LuFolder),
        ...menuConfigNodeDefault,
    ],
    "modbus-rtu": [
        createNode("Создать группу функций...", "functionGroup", LuPackage),
        ...menuConfigNodeDefault,
    ],
    functionGroup: [
        createNode("Создать объект данных...", "dataObject", LuFileDigit),
        createNode(
            "Создать объект данных... (5)",
            "dataObject",
            LuFileDigit,
            5
        ),
        ...menuConfigNodeDefault,
    ],
    gpio: [
        //createNode("Создать объект данных...", "dataObject", LuFileDigit),
        createNode("Создать папку...", "folder", LuFolder),
        ...menuConfigNodeDefault,
    ],
    folder: [
        createNode("Создать объект данных...", "dataObject", LuFileDigit),
        createNode(
            "Создать объект данных... (5)",
            "dataObject",
            LuFileDigit,
            5
        ),
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
        toggleIgnoreNode,
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
            createNode("Создать переменную...(5)", "variable", LuVariable, 5),
            { type: "separator" },
            ...menuConfigNodeDefault,
        ],
        default: [
            createNode("Создать переменную...", "variable", LuVariable),
            createNode("Создать переменную...(5)", "variable", LuVariable, 5),
            createNode("Создать папку...", "folder", LuFolder),
        ],
    },
    send: menuConfigConnections,
    receive: menuConfigConnections,
};
