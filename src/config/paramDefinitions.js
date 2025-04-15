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
    measurements,
    lengthOfASDUList,
    lengthOfAdrList,
    lengthOfCauseList,
    gpioPortList,
} from "./filterOptions";

import {
    LuRefreshCcwDot,
    LuCode,
    LuSquareTerminal,
    LuArchive,
    LuChartSpline,
} from "react-icons/lu";

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
        label: "Цикличная",
        icon: LuRefreshCcwDot,
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
        icon: LuCode,
        defaultValue: false,
    },
    graph: {
        type: "boolean",
        label: "В архив ТИ",
        icon: LuChartSpline,
        defaultValue: false,
    },
    description: {
        type: "textarea",
        label: "Описание",
    },
    cmd: {
        type: "boolean",
        label: "ТУ",
        icon: LuSquareTerminal,
        defaultValue: false,
    },
    archive: {
        type: "boolean",
        label: "В архив ТС",
        icon: LuArchive,
        defaultValue: false,
    },
    group: {
        type: "select",
        label: "Группа",
        options: groups,
    },
    measurement: {
        type: "select",
        label: "Единица измерения",
        options: measurements,
    },
    coefficient: {
        type: "number",
        label: "Коэффициент",
    },
    luaExpression: "textarea",
    specialCycleDelay: {
        type: "number",
        label: "Цикличный вызов, сек",
        rules: [{ props: { min: 0, max: 255 } }],
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
        rules: [{ props: { min: 0, max: 10000 } }],
    },
    side: {
        type: "select",
        label: "Тип",
        options: sideList,
    },
    address: {
        type: "number",
        label: "Адрес",
        rules: [
            {
                condition: { key: "lengthOfAdr", value: 1, scope: "parent" },
                props: { min: 1, max: 255 },
            },
            {
                condition: { key: "lengthOfAdr", value: 2, scope: "parent" },
                props: { min: 1, max: 65535 },
            },
            {
                condition: { key: "lengthOfAdr", value: 3, scope: "parent" },
                props: { min: 1, max: 16777215 },
            },
            { props: { min: 1, max: 65535 } },
        ],
    },
    asduAddress: {
        type: "number",
        label: "Адрес ASDU",
        rules: [
            {
                condition: { key: "lengthOfASDU", value: 1, scope: "parent" },
                props: { min: 1, max: 255 },
            },
            {
                condition: { key: "lengthOfASDU", value: 2, scope: "parent" },
                props: { min: 1, max: 65535 },
            },
        ],
    },
    deviceAddress: {
        type: "number",
        label: "Адрес устройства",
        rules: [{ props: { min: 1, max: 255 } }],
    },
    port: {
        type: "number",
        label: "Порт",
        rules: [{ props: { min: 1, max: 65535 } }],
    },
    lengthOfASDU: {
        type: "select",
        label: "Длина адреса ASDU",
        options: lengthOfASDUList,
    },
    lengthOfCause: {
        type: "select",
        label: "Длина причины передачи",
        options: lengthOfCauseList,
    },
    lengthOfAdr: {
        type: "select",
        label: "Длина адреса объекта",
        options: lengthOfAdrList,
    },
    k: {
        type: "number",
        label: "k",
        rules: [{ props: { min: 1, max: 255 } }],
    },
    w: {
        type: "number",
        label: "w",
        rules: [{ props: { min: 1, max: 255 } }],
    },
    t0: {
        type: "number",
        label: "t0",
        rules: [{ props: { min: 1, max: 255 } }],
    },
    t1: {
        type: "number",
        label: "t1",
        rules: [{ props: { min: 1, max: 255 } }],
    },
    t2: {
        type: "number",
        label: "t2",
        rules: [{ props: { min: 1, max: 255 } }],
    },
    t3: {
        type: "number",
        label: "t3",
        rules: [{ props: { min: 1, max: 255 } }],
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
        dependsOn: { key: "side", value: "server", scope: "parent" },
    },
    pollPeriod: {
        type: "number",
        label: "Период опроса",
        dependsOn: [
            { key: "side", value: "server", scope: "parent" },
            { key: "pollMode", value: "manual", scope: "self" },
        ],
        rules: [{ props: { min: 1, max: 255 } }],
    },
    variable: {
        type: "drop",
        label: "Переменная",
    },
    function: {
        type: "select",
        label: "Функция",
        options: gpioFuncType,
    },
    gpioPort: {
        type: "select",
        label: "Порт",
        options: gpioPortList,
    },
    functionModbus: {
        type: "select",
        label: "Функция",
        options: modbusFunctionGroupTypes,
    },
    sporadical: {
        type: "boolean",
        label: "Спорадический",
        defaultValue: false,
        dependsOn: { key: "side", value: "client", scope: "parent" },
    },
    aperture: {
        type: "number",
        label: "Апертура",
        dependsOn: {
            type: "and",
            conditions: [
                { key: "sporadical", value: true, scope: "parent" },
                {
                    type: "or",
                    conditions: [
                        { key: "sigType", value: "ti_scaled", scope: "self" },
                        {
                            key: "sigType",
                            value: "ti_normalized",
                            scope: "self",
                        },
                        { key: "sigType", value: "ti_float", scope: "self" },
                    ],
                },
            ],
        },
        rules: [{ props: { min: 0, max: 10000 } }],
    },
    exec: {
        type: "select",
        label: "Команда",
        options: execList,
        dependsOn: {
            type: "or",
            conditions: [
                { key: "sigType", value: "tu_one_position", scope: "self" },
                { key: "sigType", value: "tu_two_position", scope: "self" },
            ],
        },
    },
};
