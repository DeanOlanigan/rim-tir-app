const CONSTANT_VALUES = {
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

const DEFAULT_FOLDER = {
    type: "folder",
    name: "Новая папка",
    ignoreChildren: false,
    children: [],
};

const DEFAULT_FOLDER_SETTING = {
    description: "",
    group: "bemp",
    alias: "",
    tags: [],
};

const DEFAULT_INTERFACE = {
    type: "interface",
    subType: "",
    name: "Новый интерфейс",
    ignoreChildren: false,
    children: [],
};

const DEFAULT_PROTOCOL = {
    type: "protocol",
    subType: "",
    name: "Новый протокол",
    ignoreChildren: false,
    children: [],
};

const DEFAULT_FUNCTION_GROUP = {
    type: "functionGroup",
    name: "Новая функциональная группа",
    ignoreChildren: false,
    children: [],
};

const DEFAULT_ASDU = {
    type: "asdu",
    name: "Новый ASDU",
    ignoreChildren: false,
    children: [],
};

const DEFAULT_ASDU_SETTING = {
    sporadical: false,
    address: "",
    pollMode: "manual",
    pollPeriod: "",
};

const DEFAULT_DATA_OBJECT = {
    type: "dataObject",
    name: "Введите описание",
};

export const DEFAULT_DATA_OBJECT_SETTING = {
    asdu: {
        address: "12",
        type: "Однопозиционный ТС",
        aperture: null,
        exec: "",
        description: "",
        variable: "",
    },
    // gpio Bruh
    interface: {
        address: "2",
        function: "IN",
        description: "",
        variable: "",
    },
    functionGroup: {
        address: "2",
        description: "",
        variable: "",
    },
};

const DEFAULT_VARIABLE = {
    type: "variable",
    name: "Новая переменная",
};

const DEFAULT_VARIABLE_SETTING = {
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

export const DEFAULT_CONFIGURATION_DATA = {
    "modbus-rtu": {
        node: {
            ...DEFAULT_PROTOCOL,
            name: "Modbus-RTU",
            subType: "modbus-rtu",
        },
        setting: {
            ...DEFAULT_PROTOCOL,
            name: "Modbus-RTU",
            subType: "modbus-rtu",
            setting: {
                logging: false,
                deviceAddress: "1",
                stopBit: "1",
                parity: "none",
                order2: "LittleEndian",
                order4: "1-0 3-2",
            },
        },
    },
    asdu: {
        node: { ...DEFAULT_ASDU },
        setting: {
            ...DEFAULT_ASDU,
            setting: { ...DEFAULT_ASDU_SETTING },
        },
    },
    functionGroup: {
        node: { ...DEFAULT_FUNCTION_GROUP },
        setting: {
            ...DEFAULT_FUNCTION_GROUP,
            setting: {
                function: "4",
                type: "bit",
            },
        },
    },
    dataObject: {
        node: { ...DEFAULT_DATA_OBJECT },
        setting: {
            ...DEFAULT_DATA_OBJECT,
            setting: {},
        },
    },
    rs232: {
        node: { ...DEFAULT_INTERFACE, name: "RS-232", subType: "rs232" },
        setting: {
            ...DEFAULT_INTERFACE,
            name: "RS-232",
            subType: "rs232",
            setting: {
                baudRate: "57600",
                pollPeriod: "21",
            },
        },
    },
    rs485: {
        node: { ...DEFAULT_INTERFACE, name: "RS-485", subType: "rs485" },
        setting: {
            ...DEFAULT_INTERFACE,
            name: "RS-485",
            subType: "rs485",
            setting: {
                baudRate: "57600",
                pollPeriod: "21",
            },
        },
    },
    gpio: {
        node: { ...DEFAULT_INTERFACE, name: "GPIO", subType: "gpio" },
        setting: {
            ...DEFAULT_INTERFACE,
            name: "GPIO",
            subType: "gpio",
            setting: {
                logging: false,
                contactBounce: "200",
            },
        },
    },
    iec104: {
        node: { ...DEFAULT_PROTOCOL, name: "IEC-104", subType: "iec104" },
        setting: {
            ...DEFAULT_PROTOCOL,
            name: "IEC-104",
            subType: "iec104",
            setting: {
                logging: true,
                side: "client",
                address: "0.0.0.0",
                port: "0",
                lengthOfASDU: "1",
                lengthOfCause: "1",
                lengthOfAdr: "1",
                k: "1",
                w: "1",
                t0: "1",
                t1: "1",
                t2: "1",
                t3: "1",
            },
        },
    },
    folder: {
        node: { ...DEFAULT_FOLDER },
        setting: {
            ...DEFAULT_FOLDER,
            /* setting: { ...DEFAULT_FOLDER_SETTING }, */
        },
    },
    variable: {
        node: { ...DEFAULT_VARIABLE },
        setting: {
            ...DEFAULT_VARIABLE,
            setting: { ...DEFAULT_VARIABLE_SETTING },
        },
    },
};
