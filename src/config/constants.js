export const CONSTANT_VALUES = {
    PROTOCOLS: {
        modbusRTU: "modbus-rtu",
        modbusTCP: "modbus-tcp",
        modbus: "modbus",
        iec104: "iec104",
    },
    INTERFACES: {
        rs485: "rs485",
        rs232: "rs232",
        gpio: "gpio",
    },
};

export const DEFAULT_FOLDER = {
    type: "folder",
    name: "Новая папка",
    ignoreChildren: false,
    children: [],
};

export const DEFAULT_FOLDER_SETTING = {
    description: "",
    group: "bemp",
    alias: "",
    tags: [],
};

export const DEFAULT_INTERFACE = {
    type: "interface",
    subType: "",
    name: "Новый интерфейс",
    ignoreChildren: false,
    children: [],
};

export const DEFAULT_PROTOCOL = {
    type: "protocol",
    subType: "",
    name: "Новый протокол",
    ignoreChildren: false,
    children: [],
};

export const DEFAULT_ASDU = {
    type: "asdu",
    name: "Новый ASDU",
    ignoreChildren: false,
    children: [],
};

export const DEFAULT_ASDU_SETTING = {
    sporadical: false,
    address: "",
    pollMode: "manual",
    pollPeriod: "",
};

export const DEFAULT_DATA_OBJECT = {
    type: "dataObject",
    name: "Новая переменная",
};

export const DEFAULT_VARIABLE = {
    type: "variable",
    name: "Новая переменная",
};

export const DEFAULT_VARIABLE_SETTING = {
    isSpecial: false,
    type: "bit",
    isLua: false,
    description: "Введите описание",
    cmd: false,
    archive: true,
    group: "noGroup",
    measurement: null,
    coefficient: 1,
    luaExpression: "",
    specialCycleDelay: null,
};
