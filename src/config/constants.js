export const CONSTANT_VALUES = {
    PROTOCOLS: {
        modbusRTU: "modbus-rtu",
        modbusTCP: "modbus-tcp",
        modbus: "modbus",
        iec104: "iec104",
    },
    INTERFACES: {
        gpio: "gpio",
        comport: "comport",
    },
    TREE_TYPES: {
        variables: "variables",
        send: "send",
        receive: "receive",
    },
    NODE_TYPES: {
        root: "root",
        variable: "variable",
        folder: "folder",
        dataObject: "dataObject",
        protocol: "protocol",
        interface: "interface",
        asdu: "asdu",
        funcGroup: "funcGroup",
    },
};

export const ALLOWED_PARENTS = {
    "modbus-rtu": ["comport"],
    asdu: ["iec104"],
    functionGroup: ["modbus-rtu"],
    dataObject: ["functionGroup", "asdu", "folder"],
    gpio: [],
    iec104: [],
    folder: ["asdu", "gpio"],
    comport: [],
};

const DEFAULT_FOLDER = {
    type: "folder",
    name: "Новая папка",
    isIgnored: false,
    isCutted: false,
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
    isIgnored: false,
    isCutted: false,
    children: [],
};

const DEFAULT_PROTOCOL = {
    type: "protocol",
    subType: "",
    name: "Новый протокол",
    isIgnored: false,
    isCutted: false,
    children: [],
};

const DEFAULT_FUNCTION_GROUP = {
    type: "functionGroup",
    name: "Новая функциональная группа",
    isIgnored: false,
    isCutted: false,
    children: [],
};

const DEFAULT_ASDU = {
    type: "asdu",
    name: "Новый ASDU",
    isIgnored: false,
    isCutted: false,
    children: [],
};

const DEFAULT_ASDU_SETTING = {
    asduAddress: 1,
    sporadical: false,
    pollMode: "manual",
    pollPeriod: "1",
};

const DEFAULT_DATA_OBJECT = {
    type: "dataObject",
    name: "",
    isIgnored: false,
    isCutted: false,
};

export const DEFAULT_DATA_OBJECT_SETTING = {
    asdu: {
        address: "12",
        sigType: "ts_one_position",
        aperture: "10",
        exec: "direct",
        description: "",
        variable: "",
    },
    gpio: {
        gpioPort: 1,
        function: "IN",
        description: "",
        variable: "",
    },
    functionGroup: {
        modbusDoAddress: "",
        description: "",
        variable: "",
    },
};

const DEFAULT_VARIABLE = {
    type: "variable",
    name: "Новая переменная",
    isIgnored: false,
    isCutted: false,
};

const DEFAULT_VARIABLE_SETTING = {
    type: "bit",
    isSpecial: false,
    specialCycleDelay: "1",
    cmd: false,
    archive: false,
    group: "noGroup",
    graph: false,
    measurement: "V",
    aperture: "10",
    //isLua: false,
    description: "Введите описание",
    //coefficient: "1",
    luaTag: "",
    luaExpression: null,
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
                deviceAddress: "1",
                logging: false,
                stopBit: 1,
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
                functionModbus: 4,
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
                side: "client",
                logging: false,
                ipAddress: "0.0.0.0",
                port: "1",
                lengthOfASDU: 1,
                lengthOfCause: 1,
                lengthOfAdr: 1,
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
    comport: {
        node: {
            ...DEFAULT_INTERFACE,
            name: "COM порт",
            subType: "comport",
        },
        setting: {
            ...DEFAULT_INTERFACE,
            name: "COM порт",
            subType: "comport",
            setting: {
                iface: "ttyS0",
                baudRate: 57600,
            },
        },
    },
    tcpBridge: {
        node: {
            type: "tcpBridge",
            name: "TCP-коннектор",
        },
        setting: {
            type: "tcpBridge",
            name: "TCP-коннектор",
            setting: {
                logging: false,
                ipAddress: "127.0.0.1",
                port: "1002",
                side: "client",
                sendTimeout: 0.5,
                connectionTimeout: 0.5,
            },
        },
    },
};
