import {
    LuArchive,
    LuChartSpline,
    LuRefreshCcwDot,
    LuSquareTerminal,
} from "react-icons/lu";
import {
    baudRateList,
    dataTypesBytes,
    dataTypesSig,
    execList,
    gpioFuncType,
    gpioPortList,
    groups,
    ifaceList,
    lengthOfAdrList,
    lengthOfASDUList,
    lengthOfCauseList,
    measurements,
    modbusFunctionGroupTypes,
    modbusRole,
    orderFourList,
    orderTwoList,
    parityList,
    pollModeList,
    sideList,
    stopBitList,
} from "./filterOptions";
import { LOGIC, SCOPE, VALIDATOR } from "./paramDefinitions";

/**
 * @typedef {Object} nodeParam
 * @property {string} type - Тип узла (node)
 * @property {string} label - Метка узла
 * @property {Object} options - Опции узла
 * @property {Object} dependencies - Зависимости узла
 * @property {Array} rules - Правила валидации узла
 */

export const PARAM_DEFINITIONS_BY_TYPE = {
    comport: {
        /** @type {nodeParam} */
        iface: {
            type: "select",
            label: "Интерфейс",
            options: ifaceList,
            defaultValue: ifaceList.items[0].value,
        },
        /** @type {nodeParam} */
        baudRate: {
            type: "select",
            label: "Скорость",
            options: baudRateList,
            defaultValue: baudRateList.items[0].value,
        },
        /** @type {nodeParam} */
        stopBit: {
            type: "select",
            label: "Стоп-бит",
            options: stopBitList,
        },
        /** @type {nodeParam} */
        parity: {
            type: "select",
            label: "Паритет",
            options: parityList,
        },
    },
    modbusRTU: {
        /** @type {nodeParam} */
        logging: {
            type: "boolean",
            label: "Логирование",
            defaultValue: false,
        },
        /** @type {nodeParam} */
        role: {
            type: "select",
            label: "Режим",
            options: modbusRole,
            defaultValue: modbusRole.items[0].value,
        },
        /** @type {nodeParam} */
        address: {
            type: "number",
            label: "Адрес устройства",
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
        /** @type {nodeParam} */
        order2: {
            type: "select",
            label: "Порядок 2-х байт",
            options: orderTwoList,
        },
        /** @type {nodeParam} */
        order4: {
            type: "select",
            label: "Порядок 4-х байт",
            options: orderFourList,
        },
        pause: {
            type: "number",
            label: "Пауза между запросами, мс",
        },
    },
    modbusTCP: {
        /** @type {nodeParam} */
        logging: {
            type: "boolean",
            label: "Логирование",
        },
        /** @type {nodeParam} */
        side: {
            type: "select",
            label: "Тип",
            options: sideList,
        },
        /** @type {nodeParam} */
        ip: {
            type: "ip",
            label: "IP-адрес",
            rules: [
                {
                    validator: VALIDATOR.REQUIRED,
                    message: "Это поле обязательно для заполнения",
                },
            ],
        },
        /** @type {nodeParam} */
        port: {
            type: "number",
            label: "Порт",
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
        /** @type {nodeParam} */
        address: {
            type: "number",
            label: "Адрес устройства",
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
        /** @type {nodeParam} */
        order2: {
            type: "select",
            label: "Порядок 2-х байт",
            options: orderTwoList,
        },
        /** @type {nodeParam} */
        order4: {
            type: "select",
            label: "Порядок 4-х байт",
            options: orderFourList,
        },
        /** @type {nodeParam} */
        pollPeriod: {
            type: "number",
            label: "Период опроса, мин.",
        },
        /** @type {nodeParam} */
        waitResponse: {
            type: "boolean",
            label: "Ожидать ответ",
        },
    },
    functionGroup: {
        /** @type {nodeParam} */
        function: {
            type: "select",
            label: "Функция",
            options: modbusFunctionGroupTypes,
        },
        /** @type {nodeParam} */
        dataType: {
            type: "select",
            label: "Тип данных",
            options: dataTypesBytes,
        },
    },
    gpio: {
        /** @type {nodeParam} */
        logging: {
            type: "boolean",
            label: "Логирование",
        },
        /** @type {nodeParam} */
        contactBounce: {
            type: "number",
            label: "Период дребезга",
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
    },
    iec104: {
        /** @type {nodeParam} */
        logging: {
            type: "boolean",
            label: "Логирование",
        },
        /** @type {nodeParam} */
        side: {
            type: "select",
            label: "Тип",
            options: sideList,
        },
        /** @type {nodeParam} */
        ipAddress: {
            type: "ip",
            label: "IP-адрес",
            rules: [
                {
                    validator: VALIDATOR.REQUIRED,
                    message: "Это поле обязательно для заполнения",
                },
            ],
        },
        /** @type {nodeParam} */
        port: {
            type: "number",
            label: "Порт",
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
        /** @type {nodeParam} */
        lengthOfASDU: {
            type: "select",
            label: "Длина адреса ASDU",
            options: lengthOfASDUList,
        },
        /** @type {nodeParam} */
        lengthOfCause: {
            type: "select",
            label: "Длина причины передачи",
            options: lengthOfCauseList,
        },
        /** @type {nodeParam} */
        lengthOfAdr: {
            type: "select",
            label: "Длина адреса объекта",
            options: lengthOfAdrList,
        },
        /** @type {nodeParam} */
        k: {
            type: "number",
            label: "k",
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
        /** @type {nodeParam} */
        w: {
            type: "number",
            label: "w",
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
        /** @type {nodeParam} */
        t0: {
            type: "number",
            label: "t0",
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
        /** @type {nodeParam} */
        t1: {
            type: "number",
            label: "t1",
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
        /** @type {nodeParam} */
        t2: {
            type: "number",
            label: "t2",
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
        /** @type {nodeParam} */
        t3: {
            type: "number",
            label: "t3",
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
    },
    asdu: {
        /** @type {nodeParam} */
        address: {
            type: "number",
            label: "Адрес ASDU",
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
        /** @type {nodeParam} */
        sporadical: {
            type: "boolean",
            label: "Спорадический",
            dependencies: { key: "side", value: "server", scope: SCOPE.PARENT },
        },
        /** @type {nodeParam} */
        pollMode: {
            label: "Режим опроса",
            type: "select",
            options: pollModeList,
            dependencies: { key: "side", value: "client", scope: SCOPE.PARENT },
        },
        /** @type {nodeParam} */
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
    },
    dataObject: {
        gpio: {
            /** @type {nodeParam} */
            port: {
                type: "select",
                label: "Порт",
                options: gpioPortList,
            },
            /** @type {nodeParam} */
            function: {
                type: "select",
                label: "Функция",
                options: gpioFuncType,
            },
            /** @type {nodeParam} */
            description: {
                type: "textarea",
                label: "Описание",
            },
            /** @type {nodeParam} */
            variable: {
                type: "drop",
                label: "Переменная",
            },
        },
        functionGroup: {
            /** @type {nodeParam} */
            address: {
                type: "hex",
                label: "Адрес информационного объекта",
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
            /** @type {nodeParam} */
            description: {
                type: "textarea",
                label: "Описание",
            },
            /** @type {nodeParam} */
            variable: {
                type: "drop",
                label: "Переменная",
            },
        },
        asdu: {
            /** @type {nodeParam} */
            address: {
                type: "number",
                label: "Адрес информационного объекта",
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
                        message:
                            "Значение должно быть в диапазоне от 0 до 16777215",
                    },
                    {
                        validator: VALIDATOR.RANGE,
                        params: { min: 0, max: 65535 },
                        message:
                            "Значение должно быть в диапазоне от 0 до 65535",
                    },
                    {
                        validator: VALIDATOR.UNIQUE,
                        params: { within: SCOPE.SIBLINGS },
                        message:
                            "Адрес должен быть уникальным внутри родительского элемента",
                    },
                ],
            },
            /** @type {nodeParam} */
            sigType: {
                type: "select",
                label: "Тип сигнала",
                options: dataTypesSig,
            },
            /** @type {nodeParam} */
            description: {
                type: "textarea",
                label: "Описание",
            },
            /** @type {nodeParam} */
            variable: {
                type: "drop",
                label: "Переменная",
            },
            /** @type {nodeParam} */
            aperture: {
                type: "number",
                label: "Апертура",
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
                        message:
                            "Значение должно быть в диапазоне от 0 до 10000",
                    },
                ],
            },
            /** @type {nodeParam} */
            exec: {
                type: "select",
                label: "Команда",
                options: execList,
                dependencies: {
                    type: LOGIC.OR,
                    conditions: [
                        {
                            key: "sigType",
                            value: "tu_one_position",
                            scope: SCOPE.SELF,
                        },
                        {
                            key: "sigType",
                            value: "tu_two_position",
                            scope: SCOPE.SELF,
                        },
                    ],
                },
            },
        },
        /* Возможное добавление новых типов */
    },
    folder: {},
    variable: {
        /** @type {nodeParam} */
        dataType: {
            type: "select",
            label: "Тип данных",
            options: dataTypesBytes,
        },
        /** @type {nodeParam} */
        description: {
            type: "textarea",
            label: "Описание",
        },
        /** @type {nodeParam} */
        isSpecial: {
            type: "boolean",
            label: "Цикличная",
            icon: LuRefreshCcwDot,
            dependencies: { key: "type", value: "bit", scope: SCOPE.SELF },
        },
        /** @type {nodeParam} */
        specialCycleDelay: {
            type: "number",
            label: "Цикличный вызов, сек",
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
        /** @type {nodeParam} */
        graph: {
            type: "boolean",
            label: "В архив ТИ",
            icon: LuChartSpline,
            dependencies: {
                type: LOGIC.NOT,
                condition: { key: "type", value: "bit", scope: SCOPE.SELF },
            },
        },
        /** @type {nodeParam} */
        measurement: {
            type: "select",
            label: "Единица измерения",
            options: measurements,
        },
        /** @type {nodeParam} */
        aperture: {
            type: "number",
            label: "Апертура, сек",
        },
        /** @type {nodeParam} */
        cmd: {
            type: "boolean",
            label: "ТУ",
            icon: LuSquareTerminal,
            dependencies: {
                type: LOGIC.OR,
                conditions: [
                    { key: "type", value: "bit", scope: SCOPE.SELF },
                    {
                        key: "type",
                        value: "twoByteUnsigned",
                        scope: SCOPE.SELF,
                    },
                ],
            },
        },
        /** @type {nodeParam} */
        archive: {
            type: "boolean",
            label: "В архив ТС",
            icon: LuArchive,
            dependencies: {
                type: LOGIC.OR,
                conditions: [
                    { key: "type", value: "bit", scope: SCOPE.SELF },
                    {
                        key: "type",
                        value: "twoByteUnsigned",
                        scope: SCOPE.SELF,
                    },
                ],
            },
        },
        /** @type {nodeParam} */
        group: {
            type: "select",
            label: "Группа",
            options: groups,
            dependencies: {
                type: LOGIC.OR,
                conditions: [
                    { key: "type", value: "bit", scope: SCOPE.SELF },
                    {
                        key: "type",
                        value: "twoByteUnsigned",
                        scope: SCOPE.SELF,
                    },
                ],
            },
        },
        /** @type {nodeParam} */
        luaExpression: {
            type: "code",
            label: "Lua-выражение",
        },
    },
    tcpBridge: {
        /** @type {nodeParam} */
        logging: {
            type: "boolean",
            label: "Логирование",
        },
        /** @type {nodeParam} */
        side: {
            type: "select",
            label: "Тип",
            options: sideList,
        },
        /** @type {nodeParam} */
        ip: {
            type: "ip",
            label: "IP-адрес",
            rules: [
                {
                    validator: VALIDATOR.REQUIRED,
                    message: "Это поле обязательно для заполнения",
                },
            ],
        },
        /** @type {nodeParam} */
        port: {
            type: "number",
            label: "Порт",
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
        /** @type {nodeParam} */
        sendTimeout: {
            type: "number",
            label: "Таймаут приема, сек.",
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
        /** @type {nodeParam} */
        connectionTimeout: {
            type: "number",
            label: "Таймаут соединения, сек.",
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
    },
};
