import {
    dataTypesBytes,
    dataTypesSig,
    groups,
    baudRateList,
    orderTwoList,
    orderFourList,
    stopBitList,
    parityList,
    sideList,
    modbusFunctionGroupTypes,
    pollModeList,
    execList,
    gpioFuncType,
} from "./filterOptions";

export const PARENT_NAMES = {
    interface: "Интерфейс",
    protocol: "Протокол",
    folder: "Директория",
    functionGroup: "Функциональная группа",
    asdu: "ASDU",
};

export const PARAM_DEFINITIONS = {
    isSpecial: {
        type: "boolean",
        label: "Специальная",
        defaultValue: false,
    },
    type: {
        type: "select",
        label: "Тип данных",
        options: dataTypesBytes,
    },
    byteType: {
        type: "select",
        label: "Тип данных",
        options: dataTypesBytes,
    },
    sigType: {
        type: "select",
        label: "Тип сигнала",
        options: dataTypesSig,
    },
    isLua: {
        type: "boolean",
        label: "Lua",
        defaultValue: false,
    },
    description: {
        type: "textarea",
        label: "Описание",
    },
    cmd: {
        type: "boolean",
        label: "Команда пользователя",
        defaultValue: false,
    },
    archive: {
        type: "boolean",
        label: "В архив",
        defaultValue: false,
    },
    group: {
        type: "select",
        label: "Группа",
        options: groups,
    },
    measurement: {
        type: "select",
        label: "Единицы измерения",
        options: null,
    },
    coefficient: {
        type: "number",
        label: "Коэффициент",
    },
    luaExpression: "textarea",
    specialCycleDelay: {
        type: "number",
        label: "Цикличный вызов, сек",
    },
    isLog: {
        type: "boolean",
        label: "Логирование",
        defaultValue: false,
    },
    isClient: {
        type: "boolean",
        label: "Клиент",
        defaultValue: false,
    },
    logging: {
        type: "boolean",
        label: "Логирование",
        defaultValue: false,
    },
    contactBounce: {
        type: "number",
        label: "Период дребезга",
    },
    side: {
        type: "select",
        label: "Тип",
        options: sideList,
    },
    address: {
        type: "input",
        label: "Адрес",
    },
    deviceAddress: {
        type: "number",
        label: "Адрес устройства",
    },
    port: {
        type: "number",
        label: "Порт",
    },
    lengthOfASDU: {
        type: "number",
        label: "Длина адреса ASDU",
    },
    lengthOfCause: {
        type: "number",
        label: "Длина причины передачи",
    },
    lengthOfAdr: {
        type: "number",
        label: "Длина адреса объекта",
    },
    k: {
        type: "number",
        label: "k",
    },
    w: {
        type: "number",
        label: "w",
    },
    t0: {
        type: "number",
        label: "t0",
    },
    t1: {
        type: "number",
        label: "t1",
    },
    t2: {
        type: "number",
        label: "t2",
    },
    t3: {
        type: "number",
        label: "t3",
    },
    baudRate: {
        type: "select",
        label: "Скорость",
        options: baudRateList,
    },
    stopBit: {
        type: "select",
        label: "Стоп-бит",
        options: stopBitList,
    },
    parity: {
        type: "select",
        label: "Паритет",
        options: parityList,
    },
    order2: {
        type: "select",
        label: "Порядок 2-х байт",
        options: orderTwoList,
    },
    order4: {
        type: "select",
        label: "Порядок 4-х байт",
        options: orderFourList,
    },
    pollMode: {
        label: "Режим опроса",
        type: "select",
        options: pollModeList,
    },
    pollPeriod: {
        type: "number",
        label: "Период опроса",
        dependsOn: { key: "pollMode", value: "manual" },
    },
    variable: {
        type: "drop",
        label: "Переменная",
    },
    function: {
        type: "select",
        label: "Функция",
        options: modbusFunctionGroupTypes,
    },
    sporadical: {
        type: "boolean",
        label: "Спорадический",
        defaultValue: false,
    },
    aperture: {
        type: "number",
        label: "Апертура",
    },
    exec: {
        type: "select",
        label: "Команда",
        options: execList,
    },
};

export const PARAM_DEFINITIONS_SHARED = {
    logging: {
        type: "boolean",
        label: "Логирование",
        defaultValue: false,
    },
};

export const PARAM_DEFINITIONS_ = {
    gpio: {
        logging: PARAM_DEFINITIONS_SHARED.logging,
        contactBounce: {
            type: "number",
            label: "Период дребезга",
        },
    },
    rs232: {
        baudRate: {
            type: "select",
            label: "Скорость",
            options: baudRateList,
        },
    },
    rs485: {
        baudRate: {
            type: "select",
            label: "Скорость",
            options: baudRateList,
        },
    },
    iec104: {
        logging: {
            type: "boolean",
            label: "Логирование",
            defaultValue: false,
        },
        side: {
            type: "select",
            label: "Тип",
            options: sideList,
        },
        address: {
            type: "input",
            label: "Адрес",
        },
        port: {
            type: "number",
            label: "Порт",
        },
        lengthOfASDU: {
            type: "number",
            label: "Длина адреса ASDU",
        },
        lengthOfCause: {
            type: "number",
            label: "Длина причины передачи",
        },
        lengthOfAdr: {
            type: "number",
            label: "Длина адреса объекта",
        },
        k: {
            type: "number",
            label: "k",
        },
        w: {
            type: "number",
            label: "w",
        },
        t0: {
            type: "number",
            label: "t0",
        },
        t1: {
            type: "number",
            label: "t1",
        },
        t2: {
            type: "number",
            label: "t2",
        },
        t3: {
            type: "number",
            label: "t3",
        },
    },
    "modbus-rtu": {
        logging: {
            type: "boolean",
            label: "Логирование",
            defaultValue: false,
        },
        deviceAddress: {
            type: "number",
            label: "Адрес устройства",
        },
        stopBit: {
            type: "select",
            label: "Стоп-бит",
            options: stopBitList,
        },
        parity: {
            type: "select",
            label: "Паритет",
            options: parityList,
        },
        order2: {
            type: "select",
            label: "Порядок 2-х байт",
            options: orderTwoList,
        },
        order4: {
            type: "select",
            label: "Порядок 4-х байт",
            options: orderFourList,
        },
    },
    asdu: {
        sporadical: {
            type: "boolean",
            label: "Спорадический",
            defaultValue: false,
        },
        address: {
            type: "input",
            label: "Адрес",
        },
        pollMode: {
            label: "Режим опроса",
            type: "select",
            options: pollModeList,
        },
        pollPeriod: {
            type: "number",
            label: "Период опроса",
        },
    },
    functionGroup: {
        function: {
            type: "select",
            label: "Функция",
            options: modbusFunctionGroupTypes,
        },
        type: {
            type: "select",
            label: "Тип",
            options: dataTypesBytes,
        },
    },
    dataObject: {
        gpio: {
            address: {
                type: "input",
                label: "Адрес",
            },
            function: {
                type: "select",
                label: "Функция",
                options: gpioFuncType,
            },
            description: {
                type: "textarea",
                label: "Описание",
            },
            variable: {
                type: "drop",
                label: "Переменная",
            },
        },
        functionGroup: {
            address: {
                type: "input",
                label: "Адрес",
            },
            description: {
                type: "textarea",
                label: "Описание",
            },
            variable: {
                type: "drop",
                label: "Переменная",
            },
        },
        asdu: {
            address: {
                type: "input",
                label: "Адрес",
            },
            type: {
                type: "select",
                label: "Тип",
                options: dataTypesSig,
            },
            aperture: {
                type: "number",
                label: "Апертура",
            },
            exec: {
                type: "select",
                label: "Команда",
                options: execList,
            },
            description: {
                type: "textarea",
                label: "Описание",
            },
            variable: {
                type: "drop",
                label: "Переменная",
            },
        },
    },
};
