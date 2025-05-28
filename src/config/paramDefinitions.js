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
    ifaceList,
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
    dataObject: "Информационный объект",
};

export const SCOPE = {
    SELF: "self", // current node
    PARENT: "parent", // find param in parent recursively
    // TODO root не работает, т.к. нет корневого узла
    ROOT: "root", // root node only
    SIBLINGS: "siblings", // all nodes in the same parent
};

export const VALIDATOR = {
    RANGE: "range",
    REGEX: "regex",
    UNIQUE: "unique",
    CUSTOM: "custom",
    REQUIRED: "required",
};

export const LOGIC = {
    AND: "and",
    OR: "or",
    NOT: "not",
};

export const MATCH = {
    ALL: "all",
    ANY: "any",
    NONE: "none",
};

export const PARAM_DEFINITIONS = {
    isSpecial: {
        type: "boolean",
        label: "Цикличная",
        icon: LuRefreshCcwDot,
        defaultValue: false,
        dependencies: { key: "type", value: "bit", scope: SCOPE.SELF },
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
        dependencies: {
            type: LOGIC.NOT,
            condition: [{ key: "type", value: "bit", scope: SCOPE.SELF }],
        },
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
        dependencies: {
            type: LOGIC.OR,
            conditions: [
                { key: "type", value: "bit", scope: SCOPE.SELF },
                { key: "type", value: "twoByteUnsigned", scope: SCOPE.SELF },
            ],
        },
    },
    archive: {
        type: "boolean",
        label: "В архив ТС",
        icon: LuArchive,
        defaultValue: false,
        dependencies: {
            type: LOGIC.OR,
            conditions: [
                { key: "type", value: "bit", scope: SCOPE.SELF },
                { key: "type", value: "twoByteUnsigned", scope: SCOPE.SELF },
            ],
        },
    },
    group: {
        type: "select",
        label: "Группа",
        options: groups,
        dependencies: {
            type: LOGIC.OR,
            conditions: [
                { key: "type", value: "bit", scope: SCOPE.SELF },
                { key: "type", value: "twoByteUnsigned", scope: SCOPE.SELF },
            ],
        },
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
    luaExpression: {
        type: "code",
        label: "Lua-выражение",
    },
    specialCycleDelay: {
        type: "number",
        label: "Цикличный вызов, сек",
        description: "Время, через которое будет вызвана функция",
        defaultValue: 1,
        hidden: false,
        order: 1,
        helpText: "Время, через которое будет вызвана функция",
        dependencies: {
            type: LOGIC.AND,
            conditions: [
                { key: "isSpecial", value: true, scope: SCOPE.SELF },
                { key: "type", value: "bit", scope: SCOPE.SELF },
            ],
        },
        rules: [
            {
                validator: VALIDATOR.REQUIRED,
                message: "Это поле обязательно для заполнения",
            },
            {
                validator: VALIDATOR.RANGE,
                params: { min: 1, max: 255 },
                message: "Значение должно быть в диапазоне от 1 до 255",
            },
        ],
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
        description: "Период дребезга контакта, сек",
        defaultValue: 1,
        hidden: false,
        order: 1,
        helpText: "Период дребезга контакта, сек",
        rules: [
            {
                validator: VALIDATOR.REQUIRED,
                message: "Это поле обязательно для заполнения",
            },
            {
                validator: VALIDATOR.RANGE,
                params: { min: 1, max: 10000 },
                message: "Значение должно быть в диапазоне от 1 до 10000",
            },
        ],
    },
    side: {
        type: "select",
        label: "Тип",
        options: sideList,
    },
    ipAddress: {
        type: "ip",
        label: "IP-адрес",
        description: "IP-адрес в формате IPv4.",
        defaultValue: "192.168.0.1",
        hidden: false,
        order: 1,
        helpText: "IP-адрес в формате IPv4.",
        rules: [
            {
                validator: VALIDATOR.REQUIRED,
                message: "Это поле обязательно для заполнения",
            },
        ],
    },
    modbusDoAddress: {
        type: "hex",
        label: "Адрес информационного объекта",
        description: "Адрес информационного объекта в формате hex (0x00-0xFF).",
        defaultValue: "0x00",
        uniqueWithin: SCOPE.SIBLINGS,
        hidden: false,
        order: 1,
        helpText: "Адрес информационного объекта в формате hex (0x00-0xFF).",
        rules: [
            {
                validator: VALIDATOR.REQUIRED,
                message: "Это поле обязательно для заполнения",
            },
            {
                validator: VALIDATOR.UNIQUE,
                params: { within: SCOPE.SIBLINGS },
                message:
                    "Адрес должен быть уникальным внутри родительского элемента",
            },
        ],
    },
    address: {
        type: "number",
        label: "Адрес информационного объекта",
        description: "Адрес информационного объекта в формате dec.",
        defaultValue: 0,
        uniqueWithin: SCOPE.SIBLINGS,
        hidden: false,
        order: 1,
        helpText: "Адрес информационного объекта в формате dec.",
        rules: [
            {
                validator: VALIDATOR.REQUIRED,
                message: "Это поле обязательно для заполнения",
            },
            {
                validator: VALIDATOR.RANGE,
                params: { min: 0, max: 255 },
                condition: {
                    key: "lengthOfAdr",
                    value: 1,
                    scope: SCOPE.PARENT,
                },
                message: "Значение должно быть в диапазоне от 0 до 255",
            },
            {
                validator: VALIDATOR.RANGE,
                params: { min: 0, max: 16777215 },
                condition: {
                    key: "lengthOfAdr",
                    value: 3,
                    scope: SCOPE.PARENT,
                },
                message: "Значение должно быть в диапазоне от 0 до 16777215",
            },
            {
                validator: VALIDATOR.RANGE,
                params: { min: 0, max: 65535 },
                message: "Значение должно быть в диапазоне от 0 до 65535",
            },
            {
                validator: VALIDATOR.UNIQUE,
                params: { within: SCOPE.SIBLINGS },
                message:
                    "Адрес должен быть уникальным внутри родительского элемента",
            },
        ],
    },
    asduAddress: {
        type: "number",
        label: "Адрес ASDU",
        description: "Адрес ASDU в формате dec.",
        defaultValue: 1,
        uniqueWithin: SCOPE.SIBLINGS,
        hidden: false,
        order: 1,
        helpText: "Адрес ASDU в формате dec.",
        rules: [
            {
                validator: VALIDATOR.REQUIRED,
                message: "Это поле обязательно для заполнения",
            },
            {
                validator: VALIDATOR.RANGE,
                params: { min: 1, max: 65535 },
                condition: {
                    key: "lengthOfASDU",
                    value: 2,
                    scope: SCOPE.PARENT,
                },
                message: "Значение должно быть в диапазоне от 1 до 65535",
            },
            {
                validator: VALIDATOR.RANGE,
                params: { min: 1, max: 255 },
                message: "Значение должно быть в диапазоне от 1 до 255",
            },
            {
                validator: VALIDATOR.UNIQUE,
                params: { within: SCOPE.SIBLINGS },
                message:
                    "Адрес должен быть уникальным внутри родительского элемента",
            },
        ],
    },
    deviceAddress: {
        type: "number",
        label: "Адрес устройства",
        description: "Адрес устройства в формате dec.",
        defaultValue: 1,
        uniqueWithin: SCOPE.SIBLINGS,
        hidden: false,
        order: 1,
        helpText: "Адрес устройства в формате dec.",
        rules: [
            {
                validator: VALIDATOR.REQUIRED,
                message: "Это поле обязательно для заполнения",
            },
            {
                validator: VALIDATOR.RANGE,
                params: { min: 1, max: 255 },
                message: "Значение должно быть в диапазоне от 1 до 255",
            },
            {
                validator: VALIDATOR.UNIQUE,
                params: { within: SCOPE.SIBLINGS },
                message:
                    "Адрес должен быть уникальным внутри родительского элемента",
            },
        ],
    },
    iface: {
        type: "select",
        label: "Интерфейс",
        options: ifaceList,
    },
    port: {
        type: "number",
        label: "Порт",
        description: "Порт, на котором будет работать сервер, в формате dec.",
        defaultValue: 502,
        hidden: false,
        order: 1,
        helpText: "Порт, на котором будет работать сервер, в формате dec.",
        rules: [
            {
                validator: VALIDATOR.REQUIRED,
                message: "Это поле обязательно для заполнения",
            },
            {
                validator: VALIDATOR.RANGE,
                params: { min: 1, max: 65535 },
                message: "Значение должно быть в диапазоне от 1 до 65535",
            },
        ],
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
        description: "k",
        defaultValue: 1,
        hidden: false,
        order: 1,
        helpText: "k",
        rules: [
            {
                validator: VALIDATOR.REQUIRED,
                message: "Это поле обязательно для заполнения",
            },
            {
                validator: VALIDATOR.RANGE,
                params: { min: 1, max: 255 },
                message: "Значение должно быть в диапазоне от 1 до 255",
            },
        ],
    },
    w: {
        type: "number",
        label: "w",
        description: "w",
        defaultValue: 1,
        hidden: false,
        order: 1,
        helpText: "w",
        rules: [
            {
                validator: VALIDATOR.REQUIRED,
                message: "Это поле обязательно для заполнения",
            },
            {
                validator: VALIDATOR.RANGE,
                params: { min: 1, max: 255 },
                message: "Значение должно быть в диапазоне от 1 до 255",
            },
        ],
    },
    t0: {
        type: "number",
        label: "t0",
        description: "t0",
        defaultValue: 1,
        hidden: false,
        order: 1,
        helpText: "t0",
        rules: [
            {
                validator: VALIDATOR.REQUIRED,
                message: "Это поле обязательно для заполнения",
            },
            {
                validator: VALIDATOR.RANGE,
                params: { min: 1, max: 255 },
                message: "Значение должно быть в диапазоне от 1 до 255",
            },
        ],
    },
    t1: {
        type: "number",
        label: "t1",
        description: "t1",
        defaultValue: 1,
        hidden: false,
        order: 1,
        helpText: "t1",
        rules: [
            {
                validator: VALIDATOR.REQUIRED,
                message: "Это поле обязательно для заполнения",
            },
            {
                validator: VALIDATOR.RANGE,
                params: { min: 1, max: 255 },
                message: "Значение должно быть в диапазоне от 1 до 255",
            },
        ],
    },
    t2: {
        type: "number",
        label: "t2",
        description: "t2",
        defaultValue: 1,
        hidden: false,
        order: 1,
        helpText: "t2",
        rules: [
            {
                validator: VALIDATOR.REQUIRED,
                message: "Это поле обязательно для заполнения",
            },
            {
                validator: VALIDATOR.RANGE,
                params: { min: 1, max: 255 },
                message: "Значение должно быть в диапазоне от 1 до 255",
            },
        ],
    },
    t3: {
        type: "number",
        label: "t3",
        description: "t3",
        defaultValue: 1,
        hidden: false,
        order: 1,
        helpText: "t3",
        rules: [
            {
                validator: VALIDATOR.REQUIRED,
                message: "Это поле обязательно для заполнения",
            },
            {
                validator: VALIDATOR.RANGE,
                params: { min: 1, max: 255 },
                message: "Значение должно быть в диапазоне от 1 до 255",
            },
        ],
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
        dependencies: { key: "side", value: "client", scope: SCOPE.PARENT },
    },
    pollPeriod: {
        type: "number",
        label: "Период опроса, мин.",
        dependencies: {
            type: LOGIC.AND,
            conditions: [
                { key: "side", value: "client", scope: SCOPE.PARENT },
                { key: "pollMode", value: "manual", scope: SCOPE.SELF },
            ],
        },
        rules: [
            {
                validator: VALIDATOR.RANGE,
                params: { min: 1, max: 255 },
                message: "Значение должно быть в диапазоне от 1 до 255",
            },
        ],
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
        dependencies: { key: "side", value: "server", scope: SCOPE.PARENT },
    },
    aperture: {
        type: "number",
        label: "Апертура",
        description: "Апертура",
        defaultValue: 1,
        hidden: false,
        order: 1,
        helpText: "Апертура",
        dependencies: {
            type: LOGIC.AND,
            conditions: [
                { key: "sporadical", value: true, scope: SCOPE.PARENT },
                {
                    type: LOGIC.OR,
                    conditions: [
                        {
                            key: "sigType",
                            value: "ti_scaled",
                            scope: SCOPE.SELF,
                        },
                        {
                            key: "sigType",
                            value: "ti_normalized",
                            scope: SCOPE.SELF,
                        },
                        {
                            key: "sigType",
                            value: "ti_float",
                            scope: SCOPE.SELF,
                        },
                    ],
                },
            ],
        },
        rules: [
            {
                validator: VALIDATOR.REQUIRED,
                message: "Это поле обязательно для заполнения",
            },
            {
                validator: VALIDATOR.RANGE,
                params: { min: 0, max: 10000 },
                message: "Значение должно быть в диапазоне от 0 до 10000",
            },
        ],
    },
    exec: {
        type: "select",
        label: "Команда",
        options: execList,
        dependencies: {
            type: LOGIC.OR,
            conditions: [
                { key: "sigType", value: "tu_one_position", scope: SCOPE.SELF },
                { key: "sigType", value: "tu_two_position", scope: SCOPE.SELF },
            ],
        },
    },
    sendTimeout: {
        type: "number",
        label: "Таймаут приема, сек.",
        description: "Таймаут приема, сек.",
        defaultValue: 1,
        hidden: false,
        order: 1,
        helpText: "Таймаут приема, сек.",
        rules: [
            {
                validator: VALIDATOR.REQUIRED,
                message: "Это поле обязательно для заполнения",
            },
            {
                validator: VALIDATOR.RANGE,
                params: { min: 0, max: 255 },
                message: "Значение должно быть в диапазоне от 0 до 255",
            },
        ],
    },
    connectionTimeout: {
        type: "number",
        label: "Таймаут соединения, сек.",
        description: "Таймаут соединения, сек.",
        defaultValue: 1,
        hidden: false,
        order: 1,
        helpText: "Таймаут соединения, сек.",
        rules: [
            {
                validator: VALIDATOR.REQUIRED,
                message: "Это поле обязательно для заполнения",
            },
            {
                validator: VALIDATOR.RANGE,
                params: { min: 0, max: 255 },
                message: "Значение должно быть в диапазоне от 0 до 255",
            },
        ],
    },
};
