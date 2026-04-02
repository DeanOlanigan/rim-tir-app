/**
 * Сгенерировано build-test-config.js
 * НЕ редактируй вручную!
 */
// TODO Подумать над улучшением функционала контекстного меню
// TODO Подумать над необходимостью изменить описание параметров не мапой, а массивом объектов (чтобы был reorder)
export const config = [
    {
        node: "folder",
        type: "folder",
        label: "Папка",
        icon: "folder",
    },
    {
        node: "comport",
        type: "interface",
        label: "Comport",
        shortname: "COM",
        color: "purple",
        usedIn: "both",
        settings: {
            iface: {
                type: "string",
                label: "Интерфейс",
                info: "Интерфейс, к которому подключен последовательный порт",
                default: "ttyS0",
                showInTree: true,
            },
            baudRate: {
                type: "enum",
                label: "Скорость",
                default: 115200,
                showInTree: true,
                enumValues: [
                    {
                        value: 19200,
                        label: "19200",
                    },
                    {
                        value: 38400,
                        label: "38400",
                    },
                    {
                        value: 57600,
                        label: "57600",
                    },
                    {
                        value: 115200,
                        label: "115200",
                    },
                    {
                        value: 230400,
                        label: "230400",
                    },
                ],
            },
            stopBit: {
                type: "enum",
                label: "Стоп-бит",
                default: 1,
                enumValues: [
                    {
                        value: 1,
                        label: "1",
                    },
                    {
                        value: 2,
                        label: "2",
                    },
                ],
            },
            parity: {
                type: "enum",
                label: "Паритет",
                default: "none",
                enumValues: [
                    {
                        value: "none",
                        label: "Нет",
                    },
                    {
                        value: "even",
                        label: "Бит чётности",
                    },
                    {
                        value: "odd",
                        label: "Бит нечётности",
                    },
                ],
            },
        },
        children: [
            {
                node: "modbusRTU_master",
                type: "protocol",
                label: "Modbus-RTU Master",
                shortname: "MB RTU",
                color: "red",
                usedIn: "receive",
                settings: {
                    logging: {
                        type: "boolean",
                        label: "Логирование",
                        shortname: "log",
                        default: false,
                        showInTree: true,
                    },
                    address: {
                        type: "number",
                        label: "Адрес устройства",
                        default: 1,
                        showInTree: true,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "range",
                                params: {
                                    min: 1,
                                    max: 255,
                                },
                                message:
                                    "Значение должно быть в диапазоне от 1 до 255",
                            },
                        ],
                    },
                    order2: {
                        type: "enum",
                        label: "Порядок 2-х байт",
                        default: "little",
                        enumValues: [
                            {
                                value: "little",
                                label: "Младший вперед",
                            },
                            {
                                value: "big",
                                label: "Старший вперед",
                            },
                        ],
                    },
                    order4: {
                        type: "enum",
                        label: "Порядок 4-х байт",
                        default: "1-0 3-2",
                        enumValues: [
                            {
                                value: "1-0 3-2",
                                label: "1-0 3-2",
                            },
                            {
                                value: "3-2 1-0",
                                label: "3-2 1-0",
                            },
                            {
                                value: "2-3 0-1",
                                label: "2-3 0-1",
                            },
                            {
                                value: "0-1 2-3",
                                label: "0-1 2-3",
                            },
                        ],
                    },
                    pause: {
                        type: "number",
                        label: "Пауза между запросами, мс",
                        default: 50,
                    },
                },
                children: [
                    {
                        node: "functionGroup",
                        type: "protocolSpecific",
                        label: "Функциональная группа",
                        shortname: "fg",
                        color: "orange",
                        settings: {
                            function: {
                                type: "enum",
                                label: "Функция",
                                info: "Функция, которую нужно выполнить",
                                default: 1,
                                showInTree: true,
                                enumValues: [
                                    {
                                        label: "(0x01) Чтение значений из нескольких регистров флагов",
                                        value: 1,
                                    },
                                    {
                                        label: "(0x02) Чтение значений из нескольких дискретных входов",
                                        value: 2,
                                    },
                                    {
                                        label: "(0x03) Чтение значений из нескольких регистров хранения",
                                        value: 3,
                                    },
                                    {
                                        label: "(0x04) Чтение значений из нескольких регистров ввода",
                                        value: 4,
                                    },
                                    {
                                        label: "(0x05) Запись значения одного флага",
                                        value: 5,
                                    },
                                    {
                                        label: "(0x06) Запись значения в один регистр хранения",
                                        value: 6,
                                    },
                                    {
                                        label: "(0x15) Запись значений в несколько регистров флагов",
                                        value: 15,
                                    },
                                    {
                                        label: "(0x16) Запись значений в несколько регистров хранения",
                                        value: 16,
                                    },
                                ],
                            },
                            dataType: {
                                type: "enum",
                                label: "Тип данных",
                                showInTree: true,
                                enumValues: [
                                    {
                                        label: "1 бит - bool",
                                        value: "bit",
                                    },
                                    {
                                        label: "2 байта - целое без знака",
                                        value: "ushort",
                                    },
                                    {
                                        label: "2 байта - целое",
                                        value: "short",
                                    },
                                    {
                                        label: "4 байта - целое",
                                        value: "int",
                                    },
                                    {
                                        label: "4 байта - целое без знака",
                                        value: "uint",
                                    },
                                    {
                                        label: "4 байта - с плавающей точкой",
                                        value: "float",
                                    },
                                ],
                                rules: [
                                    {
                                        validator: "required",
                                        message:
                                            "Это поле обязательно для заполнения",
                                    },
                                    {
                                        validator: "mustBe",
                                        params: ["bit"],
                                        workIf: {
                                            or: [
                                                {
                                                    "==": [
                                                        {
                                                            find: [
                                                                {
                                                                    what: "function",
                                                                    where: "self",
                                                                },
                                                            ],
                                                        },
                                                        1,
                                                    ],
                                                },
                                                {
                                                    "==": [
                                                        {
                                                            find: [
                                                                {
                                                                    what: "function",
                                                                    where: "self",
                                                                },
                                                            ],
                                                        },
                                                        2,
                                                    ],
                                                },
                                                {
                                                    "==": [
                                                        {
                                                            find: [
                                                                {
                                                                    what: "function",
                                                                    where: "self",
                                                                },
                                                            ],
                                                        },
                                                        15,
                                                    ],
                                                },
                                            ],
                                        },
                                        message:
                                            "Данный тип данных не подходит для функций 1,2,15",
                                    },
                                    {
                                        validator: "mustBe",
                                        params: [
                                            "bit",
                                            "ushort",
                                            "short",
                                            "int",
                                            "uint",
                                            "float",
                                        ],
                                        workIf: {
                                            or: [
                                                {
                                                    "==": [
                                                        {
                                                            find: [
                                                                {
                                                                    what: "function",
                                                                    where: "self",
                                                                },
                                                            ],
                                                        },
                                                        3,
                                                    ],
                                                },
                                                {
                                                    "==": [
                                                        {
                                                            find: [
                                                                {
                                                                    what: "function",
                                                                    where: "self",
                                                                },
                                                            ],
                                                        },
                                                        4,
                                                    ],
                                                },
                                                {
                                                    "==": [
                                                        {
                                                            find: [
                                                                {
                                                                    what: "function",
                                                                    where: "self",
                                                                },
                                                            ],
                                                        },
                                                        5,
                                                    ],
                                                },
                                                {
                                                    "==": [
                                                        {
                                                            find: [
                                                                {
                                                                    what: "function",
                                                                    where: "self",
                                                                },
                                                            ],
                                                        },
                                                        16,
                                                    ],
                                                },
                                            ],
                                        },
                                        message:
                                            "Данный тип данных не подходит для функций 3,4,5,16",
                                    },
                                    {
                                        validator: "mustBe",
                                        params: ["bit", "ushort", "short"],
                                        workIf: {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "function",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                6,
                                            ],
                                        },
                                        message:
                                            "Данный тип данных не подходит для функций 6",
                                    },
                                ],
                            },
                        },
                        children: [
                            {
                                node: "dataObject",
                                type: "dataObject",
                                label: "Объект данных",
                                bulkCreation: {
                                    enabled: true,
                                    presets: [1, 2, 3, 5, 10],
                                },
                                icon: "fileDigit",
                                settings: {
                                    address: {
                                        type: "string",
                                        label: "Адрес информационного объекта",
                                        showInTree: true,
                                        rules: [
                                            {
                                                validator: "required",
                                                message:
                                                    "Это поле обязательно для заполнения",
                                            },
                                            {
                                                validator: "range",
                                                params: {
                                                    min: 0x0,
                                                    max: 0xffff,
                                                },
                                                message:
                                                    "Значение должно быть в диапазоне от 0x0 до 0xffff",
                                            },
                                            {
                                                validator: "regex",
                                                params: {
                                                    regex: "^0[xX][0-9a-fA-F]+$",
                                                },
                                                message:
                                                    "Неверный формат адреса информационного объекта",
                                            },
                                            {
                                                validator: "unique",
                                                params: {
                                                    within: "ignoreFolder",
                                                },
                                                message:
                                                    "Адрес должен быть уникальным внутри родительского элемента",
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                node: "folder",
                                type: "folder",
                                label: "Папка",
                                icon: "folder",
                            },
                        ],
                        validationRules: [
                            {
                                validator: "uniqueComposite",
                                params: {
                                    fields: ["function", "dataType"],
                                    within: "siblings",
                                },
                                message:
                                    "Функция и тип данных должны быть уникальными внутри родительского элемента",
                            },
                        ],
                    },
                ],
            },
            {
                node: "modbusRTU_slave",
                type: "protocol",
                label: "Modbus-RTU Slave",
                shortname: "MB RTU",
                color: "red",
                usedIn: "send",
                settings: {
                    logging: {
                        type: "boolean",
                        label: "Логирование",
                        shortname: "log",
                        default: false,
                        showInTree: true,
                    },
                    address: {
                        type: "number",
                        label: "Адрес устройства",
                        default: 1,
                        showInTree: true,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "range",
                                params: {
                                    min: 1,
                                    max: 255,
                                },
                                message:
                                    "Значение должно быть в диапазоне от 1 до 255",
                            },
                        ],
                    },
                    order2: {
                        type: "enum",
                        label: "Порядок 2-х байт",
                        default: "little",
                        enumValues: [
                            {
                                value: "little",
                                label: "Младший вперед",
                            },
                            {
                                value: "big",
                                label: "Старший вперед",
                            },
                        ],
                    },
                    order4: {
                        type: "enum",
                        label: "Порядок 4-х байт",
                        default: "1-0 3-2",
                        enumValues: [
                            {
                                value: "1-0 3-2",
                                label: "1-0 3-2",
                            },
                            {
                                value: "3-2 1-0",
                                label: "3-2 1-0",
                            },
                            {
                                value: "2-3 0-1",
                                label: "2-3 0-1",
                            },
                            {
                                value: "0-1 2-3",
                                label: "0-1 2-3",
                            },
                        ],
                    },
                },
                children: [
                    {
                        node: "functionGroup",
                        type: "protocolSpecific",
                        label: "Функциональная группа",
                        shortname: "fg",
                        color: "orange",
                        settings: {
                            function: {
                                type: "enum",
                                label: "Функция",
                                default: 1,
                                showInTree: true,
                                enumValues: [
                                    {
                                        label: "(0x01) Чтение значений из нескольких регистров флагов",
                                        value: 1,
                                    },
                                    {
                                        label: "(0x02) Чтение значений из нескольких дискретных входов",
                                        value: 2,
                                    },
                                    {
                                        label: "(0x03) Чтение значений из нескольких регистров хранения",
                                        value: 3,
                                    },
                                    {
                                        label: "(0x04) Чтение значений из нескольких регистров ввода",
                                        value: 4,
                                    },
                                    {
                                        label: "(0x05) Запись значения одного флага",
                                        value: 5,
                                    },
                                    {
                                        label: "(0x06) Запись значения в один регистр хранения",
                                        value: 6,
                                    },
                                    {
                                        label: "(0x15) Запись значений в несколько регистров флагов",
                                        value: 15,
                                    },
                                    {
                                        label: "(0x16) Запись значений в несколько регистров хранения",
                                        value: 16,
                                    },
                                ],
                            },
                            dataType: {
                                type: "enum",
                                label: "Тип данных",
                                showInTree: true,
                                enumValues: [
                                    {
                                        label: "1 бит - bool",
                                        value: "bit",
                                    },
                                    {
                                        label: "2 байта - целое без знака",
                                        value: "ushort",
                                    },
                                    {
                                        label: "2 байта - целое",
                                        value: "short",
                                    },
                                    {
                                        label: "4 байта - целое",
                                        value: "int",
                                    },
                                    {
                                        label: "4 байта - целое без знака",
                                        value: "uint",
                                    },
                                    {
                                        label: "4 байта - с плавающей точкой",
                                        value: "float",
                                    },
                                ],
                                rules: [
                                    {
                                        validator: "required",
                                        message:
                                            "Это поле обязательно для заполнения",
                                    },
                                    {
                                        validator: "mustBe",
                                        params: ["bit"],
                                        workIf: {
                                            or: [
                                                {
                                                    "==": [
                                                        {
                                                            find: [
                                                                {
                                                                    what: "function",
                                                                    where: "self",
                                                                },
                                                            ],
                                                        },
                                                        1,
                                                    ],
                                                },
                                                {
                                                    "==": [
                                                        {
                                                            find: [
                                                                {
                                                                    what: "function",
                                                                    where: "self",
                                                                },
                                                            ],
                                                        },
                                                        2,
                                                    ],
                                                },
                                                {
                                                    "==": [
                                                        {
                                                            find: [
                                                                {
                                                                    what: "function",
                                                                    where: "self",
                                                                },
                                                            ],
                                                        },
                                                        15,
                                                    ],
                                                },
                                            ],
                                        },
                                        message:
                                            "Данный тип данных не подходит для функций 1,2,15",
                                    },
                                    {
                                        validator: "mustBe",
                                        params: [
                                            "bit",
                                            "ushort",
                                            "short",
                                            "int",
                                            "uint",
                                            "float",
                                        ],
                                        workIf: {
                                            or: [
                                                {
                                                    "==": [
                                                        {
                                                            find: [
                                                                {
                                                                    what: "function",
                                                                    where: "self",
                                                                },
                                                            ],
                                                        },
                                                        3,
                                                    ],
                                                },
                                                {
                                                    "==": [
                                                        {
                                                            find: [
                                                                {
                                                                    what: "function",
                                                                    where: "self",
                                                                },
                                                            ],
                                                        },
                                                        4,
                                                    ],
                                                },
                                                {
                                                    "==": [
                                                        {
                                                            find: [
                                                                {
                                                                    what: "function",
                                                                    where: "self",
                                                                },
                                                            ],
                                                        },
                                                        5,
                                                    ],
                                                },
                                                {
                                                    "==": [
                                                        {
                                                            find: [
                                                                {
                                                                    what: "function",
                                                                    where: "self",
                                                                },
                                                            ],
                                                        },
                                                        16,
                                                    ],
                                                },
                                            ],
                                        },
                                        message:
                                            "Данный тип данных не подходит для функций 3,4,5,16",
                                    },
                                    {
                                        validator: "mustBe",
                                        params: ["bit", "ushort", "short"],
                                        workIf: {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "function",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                6,
                                            ],
                                        },
                                        message:
                                            "Данный тип данных не подходит для функций 6",
                                    },
                                ],
                            },
                        },
                        children: [
                            {
                                node: "dataObject",
                                type: "dataObject",
                                label: "Объект данных",
                                bulkCreation: {
                                    enabled: true,
                                    presets: [1, 2, 3, 5, 10],
                                },
                                icon: "fileDigit",
                                settings: {
                                    address: {
                                        type: "string",
                                        label: "Адрес информационного объекта",
                                        showInTree: true,
                                        rules: [
                                            {
                                                validator: "required",
                                                message:
                                                    "Это поле обязательно для заполнения",
                                            },
                                            {
                                                validator: "regex",
                                                params: {
                                                    regex: "^0[xX][0-9a-fA-F]+$",
                                                },
                                                message:
                                                    "Неверный формат адреса информационного объекта",
                                            },
                                            {
                                                validator: "range",
                                                params: {
                                                    min: 0x0,
                                                    max: 0xffff,
                                                },
                                                message:
                                                    "Значение должно быть в диапазоне от 0x0 до 0xffff",
                                            },
                                            {
                                                validator: "unique",
                                                params: {
                                                    within: "ignoreFolder",
                                                },
                                                message:
                                                    "Адрес должен быть уникальным внутри родительского элемента",
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                node: "folder",
                                type: "folder",
                                label: "Папка",
                                icon: "folder",
                            },
                        ],
                        validationRules: [
                            {
                                validator: "uniqueComposite",
                                params: {
                                    fields: ["function", "dataType"],
                                    within: "siblings",
                                },
                                message:
                                    "Функция и тип данных должны быть уникальными внутри родительского элемента",
                            },
                        ],
                    },
                ],
            },
            {
                node: "tcpBridge_server",
                type: "interfaceSpecific",
                label: "TCP-мост (сервер)",
                shortname: "TCP",
                usedIn: "receive",
                color: "green",
                settings: {
                    logging: {
                        type: "boolean",
                        label: "Логирование",
                        shortname: "log",
                        default: false,
                        showInTree: true,
                    },
                    ip: {
                        type: "string",
                        label: "IP-адрес",
                        default: "127.0.0.1",
                        showInTree: true,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "regex",
                                params: {
                                    regex: "^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$",
                                },
                                message: "Неверный формат IP-адреса",
                            },
                        ],
                    },
                    port: {
                        type: "number",
                        label: "Порт",
                        default: 502,
                        showInTree: true,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "range",
                                params: {
                                    min: 1,
                                    max: 65535,
                                },
                                message:
                                    "Значение должно быть в диапазоне от 1 до 65535",
                            },
                        ],
                    },
                    sendTimeout: {
                        type: "number",
                        label: "Таймаут приема, сек.",
                        default: 1,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "range",
                                params: {
                                    min: 0,
                                    max: 255,
                                },
                                message:
                                    "Значение должно быть в диапазоне от 0 до 255",
                            },
                        ],
                    },
                    connectionTimeout: {
                        type: "number",
                        label: "Таймаут соединения, сек.",
                        default: 1,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "range",
                                params: {
                                    min: 0,
                                    max: 255,
                                },
                                message:
                                    "Значение должно быть в диапазоне от 0 до 255",
                            },
                        ],
                    },
                },
            },
            {
                node: "tcpBridge_client",
                type: "interfaceSpecific",
                label: "TCP-мост (клиент)",
                shortname: "TCP",
                usedIn: "send",
                color: "green",
                settings: {
                    logging: {
                        type: "boolean",
                        label: "Логирование",
                        shortname: "log",
                        default: false,
                        showInTree: true,
                    },
                    ip: {
                        type: "string",
                        label: "IP-адрес",
                        default: "127.0.0.1",
                        showInTree: true,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "regex",
                                params: {
                                    regex: "^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$",
                                },
                                message: "Неверный формат IP-адреса",
                            },
                        ],
                    },
                    port: {
                        type: "number",
                        label: "Порт",
                        default: 502,
                        showInTree: true,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "range",
                                params: {
                                    min: 1,
                                    max: 65535,
                                },
                                message:
                                    "Значение должно быть в диапазоне от 1 до 65535",
                            },
                        ],
                    },
                    sendTimeout: {
                        type: "number",
                        label: "Таймаут приема, сек.",
                        default: 1,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "range",
                                params: {
                                    min: 0,
                                    max: 255,
                                },
                                message:
                                    "Значение должно быть в диапазоне от 0 до 255",
                            },
                        ],
                    },
                    connectionTimeout: {
                        type: "number",
                        label: "Таймаут соединения, сек.",
                        default: 1,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "range",
                                params: {
                                    min: 0,
                                    max: 255,
                                },
                                message:
                                    "Значение должно быть в диапазоне от 0 до 255",
                            },
                        ],
                    },
                },
            },
        ],
    },
    {
        node: "gpio",
        type: "interface",
        label: "GPIO",
        shortname: "gpio",
        color: "purple",
        settings: {
            logging: {
                type: "boolean",
                label: "Логирование",
                shortname: "log",
                default: false,
                showInTree: true,
            },
            contactBounce: {
                type: "number",
                label: "Период дребезга",
                default: 200,
                showInTree: true,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 10000,
                        },
                        message:
                            "Значение должно быть в диапазоне от 1 до 10000",
                    },
                ],
            },
        },
        children: [
            {
                node: "dataObject",
                type: "dataObject",
                label: "Объект данных",
                bulkCreation: {
                    enabled: true,
                    presets: [1, 2, 3, 5, 10],
                },
                icon: "fileDigit",
                settings: {
                    port: {
                        type: "string",
                        label: "Порт",
                        default: 1,
                        showInTree: true,
                    },
                    function: {
                        type: "enum",
                        label: "Функция",
                        default: "in",
                        showInTree: true,
                        enumValues: [
                            {
                                label: "Вход",
                                value: "in",
                            },
                            {
                                label: "Выход",
                                value: "out",
                            },
                        ],
                    },
                },
            },
            {
                node: "folder",
                type: "folder",
                label: "Папка",
                icon: "folder",
            },
        ],
    },
    {
        node: "iec104_client",
        type: "protocol",
        label: "IEC-104 Клиент",
        shortname: "iec104",
        color: "red",
        usedIn: "receive",
        settings: {
            logging: {
                type: "boolean",
                label: "Логирование",
                shortname: "log",
                default: false,
                showInTree: true,
            },
            ip: {
                type: "string",
                label: "IP-адрес",
                default: "127.0.0.1",
                showInTree: true,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "regex",
                        params: {
                            regex: "^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$",
                        },
                        message: "Неверный формат IP-адреса",
                    },
                ],
            },
            port: {
                type: "number",
                label: "Порт",
                default: 102,
                showInTree: true,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 65535,
                        },
                        message:
                            "Значение должно быть в диапазоне от 1 до 65535",
                    },
                ],
            },
            lengthOfASDU: {
                type: "enum",
                label: "Длина адреса ASDU",
                default: 1,
                enumValues: [
                    {
                        label: "1 байт",
                        value: 1,
                    },
                    {
                        label: "2 байта",
                        value: 2,
                    },
                ],
            },
            lengthOfCause: {
                type: "enum",
                label: "Длина причины передачи",
                default: 1,
                enumValues: [
                    {
                        label: "1 байт",
                        value: 1,
                    },
                    {
                        label: "2 байта",
                        value: 2,
                    },
                ],
            },
            lengthOfAdr: {
                type: "enum",
                label: "Длина адреса объекта",
                default: 1,
                enumValues: [
                    {
                        label: "1 байт",
                        value: 1,
                    },
                    {
                        label: "2 байта",
                        value: 2,
                    },
                    {
                        label: "3 байта",
                        value: 3,
                    },
                ],
            },
            k: {
                type: "number",
                label: "k",
                default: 1,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 1 до 255",
                    },
                ],
            },
            w: {
                type: "number",
                label: "w",
                default: 1,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 1 до 255",
                    },
                ],
            },
            t0: {
                type: "number",
                label: "t0",
                default: 1,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 1 до 255",
                    },
                ],
            },
            t1: {
                type: "number",
                label: "t1",
                default: 1,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 1 до 255",
                    },
                ],
            },
            t2: {
                type: "number",
                label: "t2",
                default: 1,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 1 до 255",
                    },
                ],
            },
            t3: {
                type: "number",
                label: "t3",
                default: 1,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 1 до 255",
                    },
                ],
            },
        },
        children: [
            {
                node: "asdu",
                type: "protocolSpecific",
                label: "ASDU",
                shortname: "asdu",
                color: "orange",
                settings: {
                    address: {
                        type: "number",
                        label: "Адрес ASDU",
                        default: 1,
                        showInTree: true,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "range",
                                params: {
                                    min: 1,
                                    max: 65535,
                                },
                                workIf: {
                                    "==": [
                                        {
                                            find: [
                                                {
                                                    what: "lengthOfASDU",
                                                    where: "parent",
                                                },
                                            ],
                                        },
                                        2,
                                    ],
                                },
                                message:
                                    "Значение должно быть в диапазоне от 1 до 65535",
                            },
                            {
                                validator: "range",
                                params: {
                                    min: 1,
                                    max: 255,
                                },
                                message:
                                    "Значение должно быть в диапазоне от 1 до 255",
                            },
                            {
                                validator: "unique",
                                params: {
                                    within: "siblings",
                                },
                                message:
                                    "Адрес должен быть уникальным внутри родительского элемента",
                            },
                        ],
                    },
                    pollMode: {
                        label: "Режим опроса",
                        type: "enum",
                        default: "manual",
                        enumValues: [
                            {
                                label: "Ручной",
                                value: "manual",
                            },
                            {
                                label: "На старте",
                                value: "onStart",
                            },
                            {
                                label: "Всегда",
                                value: "always",
                            },
                            {
                                label: "Без опроса",
                                value: "noPoll",
                            },
                        ],
                    },
                    pollPeriod: {
                        type: "number",
                        label: "Период опроса, мин.",
                        default: 1,
                        visibleIf: {
                            "==": [
                                {
                                    find: [
                                        {
                                            what: "pollMode",
                                            where: "self",
                                        },
                                    ],
                                },
                                "manual",
                            ],
                        },
                        rules: [
                            {
                                validator: "range",
                                params: {
                                    min: 1,
                                    max: 255,
                                },
                                message:
                                    "Значение должно быть в диапазоне от 1 до 255",
                            },
                        ],
                    },
                },
                children: [
                    {
                        node: "dataObject",
                        type: "dataObject",
                        label: "Объект данных",
                        bulkCreation: {
                            enabled: true,
                            presets: [1, 2, 3, 5, 10],
                        },
                        icon: "fileDigit",
                        settings: {
                            address: {
                                type: "number",
                                label: "Адрес информационного объекта",
                                showInTree: true,
                                rules: [
                                    {
                                        validator: "required",
                                        message:
                                            "Это поле обязательно для заполнения",
                                    },
                                    {
                                        validator: "range",
                                        params: {
                                            min: 0,
                                            max: 255,
                                        },
                                        workIf: {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "lengthOfAdr",
                                                            where: "parent",
                                                        },
                                                    ],
                                                },
                                                1,
                                            ],
                                        },
                                        message:
                                            "Значение должно быть в диапазоне от 0 до 255",
                                    },
                                    {
                                        validator: "range",
                                        params: {
                                            min: 0,
                                            max: 16777215,
                                        },
                                        workIf: {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "lengthOfAdr",
                                                            where: "parent",
                                                        },
                                                    ],
                                                },
                                                3,
                                            ],
                                        },
                                        message:
                                            "Значение должно быть в диапазоне от 0 до 16777215",
                                    },
                                    {
                                        validator: "range",
                                        params: {
                                            min: 0,
                                            max: 65535,
                                        },
                                        message:
                                            "Значение должно быть в диапазоне от 0 до 65535",
                                    },
                                    {
                                        validator: "unique",
                                        params: {
                                            within: "siblings",
                                        },
                                        message:
                                            "Адрес должен быть уникальным внутри родительского элемента",
                                    },
                                ],
                            },
                            sigType: {
                                type: "enum",
                                label: "Тип сигнала",
                                default: "ts1",
                                showInTree: true,
                                enumValues: [
                                    {
                                        label: "Однопозиционный ТС",
                                        value: "ts1",
                                    },
                                    {
                                        label: "Двухпозиционный ТС",
                                        value: "ts2",
                                    },
                                    {
                                        label: "ТИ масштабированное",
                                        value: "tis",
                                    },
                                    {
                                        label: "ТИ нормализованное",
                                        value: "tin",
                                    },
                                    {
                                        label: "ТИ с плавающей точкой ",
                                        value: "tif",
                                    },
                                    {
                                        label: "Однопозиционное ТУ",
                                        value: "tu1",
                                    },
                                    {
                                        label: "Двухпозиционное ТУ",
                                        value: "tu2",
                                    },
                                ],
                            },
                            exec: {
                                type: "enum",
                                label: "Команда",
                                default: "direct",
                                enumValues: [
                                    {
                                        label: "Прямое",
                                        value: "direct",
                                    },
                                    {
                                        label: "Выбор/исполнить",
                                        value: "select",
                                    },
                                ],
                                visibleIf: {
                                    or: [
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "sigType",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                "tu1",
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "sigType",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                "tu2",
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    {
                        node: "folder",
                        type: "folder",
                        label: "Папка",
                        icon: "folder",
                    },
                ],
            },
        ],
    },
    {
        node: "iec104_server",
        type: "protocol",
        label: "IEC-104 Сервер",
        shortname: "iec104",
        color: "red",
        usedIn: "send",
        settings: {
            logging: {
                type: "boolean",
                label: "Логирование",
                shortname: "log",
                default: false,
                showInTree: true,
            },
            ip: {
                type: "string",
                label: "IP-адрес",
                default: "127.0.0.1",
                showInTree: true,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "regex",
                        params: {
                            regex: "^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$",
                        },
                        message: "Неверный формат IP-адреса",
                    },
                ],
            },
            port: {
                type: "number",
                label: "Порт",
                default: 102,
                showInTree: true,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 65535,
                        },
                        message:
                            "Значение должно быть в диапазоне от 1 до 65535",
                    },
                ],
            },
            lengthOfASDU: {
                type: "enum",
                label: "Длина адреса ASDU",
                default: 1,
                enumValues: [
                    {
                        label: "1 байт",
                        value: 1,
                    },
                    {
                        label: "2 байта",
                        value: 2,
                    },
                ],
            },
            lengthOfCause: {
                type: "enum",
                label: "Длина причины передачи",
                default: 1,
                enumValues: [
                    {
                        label: "1 байт",
                        value: 1,
                    },
                    {
                        label: "2 байта",
                        value: 2,
                    },
                ],
            },
            lengthOfAdr: {
                type: "enum",
                label: "Длина адреса объекта",
                default: 1,
                enumValues: [
                    {
                        label: "1 байт",
                        value: 1,
                    },
                    {
                        label: "2 байта",
                        value: 2,
                    },
                    {
                        label: "3 байта",
                        value: 3,
                    },
                ],
            },
            k: {
                type: "number",
                label: "k",
                default: 1,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 1 до 255",
                    },
                ],
            },
            w: {
                type: "number",
                label: "w",
                default: 1,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 1 до 255",
                    },
                ],
            },
            t0: {
                type: "number",
                label: "t0",
                default: 1,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 1 до 255",
                    },
                ],
            },
            t1: {
                type: "number",
                label: "t1",
                default: 1,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 1 до 255",
                    },
                ],
            },
            t2: {
                type: "number",
                label: "t2",
                default: 1,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 1 до 255",
                    },
                ],
            },
            t3: {
                type: "number",
                label: "t3",
                default: 1,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 1 до 255",
                    },
                ],
            },
        },
        children: [
            {
                node: "asdu",
                type: "protocolSpecific",
                label: "ASDU",
                shortname: "asdu",
                color: "orange",
                settings: {
                    sporadical: {
                        type: "boolean",
                        label: "Спорадика",
                        default: false,
                    },
                    address: {
                        type: "number",
                        label: "Адрес ASDU",
                        default: 1,
                        showInTree: true,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "range",
                                params: {
                                    min: 1,
                                    max: 65535,
                                },
                                workIf: {
                                    "==": [
                                        {
                                            find: [
                                                {
                                                    what: "lengthOfASDU",
                                                    where: "parent",
                                                },
                                            ],
                                        },
                                        2,
                                    ],
                                },
                                message:
                                    "Значение должно быть в диапазоне от 1 до 65535",
                            },
                            {
                                validator: "range",
                                params: {
                                    min: 1,
                                    max: 255,
                                },
                                message:
                                    "Значение должно быть в диапазоне от 1 до 255",
                            },
                            {
                                validator: "unique",
                                params: {
                                    within: "siblings",
                                },
                                message:
                                    "Адрес должен быть уникальным внутри родительского элемента",
                            },
                        ],
                    },
                },
                children: [
                    {
                        node: "dataObject",
                        type: "dataObject",
                        label: "Объект данных",
                        bulkCreation: {
                            enabled: true,
                            presets: [1, 2, 3, 5, 10],
                        },
                        icon: "fileDigit",
                        settings: {
                            address: {
                                type: "number",
                                label: "Адрес информационного объекта",
                                showInTree: true,
                                rules: [
                                    {
                                        validator: "required",
                                        message:
                                            "Это поле обязательно для заполнения",
                                    },
                                    {
                                        validator: "range",
                                        params: {
                                            min: 0,
                                            max: 255,
                                        },
                                        workIf: {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "lengthOfAdr",
                                                            where: "parent",
                                                        },
                                                    ],
                                                },
                                                1,
                                            ],
                                        },
                                        message:
                                            "Значение должно быть в диапазоне от 0 до 255",
                                    },
                                    {
                                        validator: "range",
                                        params: {
                                            min: 0,
                                            max: 16777215,
                                        },
                                        workIf: {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "lengthOfAdr",
                                                            where: "parent",
                                                        },
                                                    ],
                                                },
                                                3,
                                            ],
                                        },
                                        message:
                                            "Значение должно быть в диапазоне от 0 до 16777215",
                                    },
                                    {
                                        validator: "range",
                                        params: {
                                            min: 0,
                                            max: 65535,
                                        },
                                        message:
                                            "Значение должно быть в диапазоне от 0 до 65535",
                                    },
                                    {
                                        validator: "unique",
                                        params: {
                                            within: "siblings",
                                        },
                                        message:
                                            "Адрес должен быть уникальным внутри родительского элемента",
                                    },
                                ],
                            },
                            sigType: {
                                type: "enum",
                                label: "Тип сигнала",
                                default: "ts1",
                                showInTree: true,
                                enumValues: [
                                    {
                                        label: "Однопозиционный ТС",
                                        value: "ts1",
                                    },
                                    {
                                        label: "Двухпозиционный ТС",
                                        value: "ts2",
                                    },
                                    {
                                        label: "ТИ масштабированное",
                                        value: "tis",
                                    },
                                    {
                                        label: "ТИ нормализованное",
                                        value: "tin",
                                    },
                                    {
                                        label: "ТИ с плавающей точкой ",
                                        value: "tif",
                                    },
                                    {
                                        label: "Однопозиционное ТУ",
                                        value: "tu1",
                                    },
                                    {
                                        label: "Двухпозиционное ТУ",
                                        value: "tu2",
                                    },
                                ],
                            },
                            aperture: {
                                type: "number",
                                label: "Апертура",
                                default: 0,
                                visibleIf: {
                                    or: [
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "sporadical",
                                                            where: "parent",
                                                        },
                                                    ],
                                                },
                                                true,
                                            ],
                                        },
                                        {
                                            or: [
                                                {
                                                    "==": [
                                                        {
                                                            find: [
                                                                {
                                                                    what: "sigType",
                                                                    where: "self",
                                                                },
                                                            ],
                                                        },
                                                        "tis",
                                                    ],
                                                },
                                                {
                                                    "==": [
                                                        {
                                                            find: [
                                                                {
                                                                    what: "sigType",
                                                                    where: "self",
                                                                },
                                                            ],
                                                        },
                                                        "tin",
                                                    ],
                                                },
                                                {
                                                    "==": [
                                                        {
                                                            find: [
                                                                {
                                                                    what: "sigType",
                                                                    where: "self",
                                                                },
                                                            ],
                                                        },
                                                        "tif",
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                rules: [
                                    {
                                        validator: "range",
                                        params: {
                                            min: 0,
                                            max: 10000,
                                        },
                                        message:
                                            "Значение должно быть в диапазоне от 0 до 10000",
                                    },
                                ],
                            },
                            exec: {
                                type: "enum",
                                label: "Команда",
                                default: "direct",
                                enumValues: [
                                    {
                                        label: "Прямое",
                                        value: "direct",
                                    },
                                    {
                                        label: "Выбор/исполнить",
                                        value: "select",
                                    },
                                ],
                                visibleIf: {
                                    or: [
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "sigType",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                "tu1",
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "sigType",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                "tu2",
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    {
                        node: "folder",
                        type: "folder",
                        label: "Папка",
                        icon: "folder",
                    },
                ],
            },
        ],
    },
    {
        node: "modbusTCP_client",
        type: "protocol",
        label: "Modbus-TCP Клиент",
        usedIn: "receive",
        shortname: "MB TCP",
        color: "red",
        settings: {
            logging: {
                type: "boolean",
                label: "Логирование",
                shortname: "log",
                default: false,
                showInTree: true,
            },
            ip: {
                type: "string",
                label: "IP-адрес",
                default: "127.0.0.1",
                showInTree: true,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "regex",
                        params: {
                            regex: "^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$",
                        },
                        message: "Неверный формат IP-адреса",
                    },
                ],
            },
            port: {
                type: "number",
                label: "Порт",
                default: 502,
                showInTree: true,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 65535,
                        },
                        message:
                            "Значение должно быть в диапазоне от 1 до 65535",
                    },
                ],
            },
            address: {
                type: "number",
                label: "Адрес устройства",
                default: 1,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 1 до 255",
                    },
                ],
            },
            order2: {
                type: "enum",
                label: "Порядок 2-х байт",
                default: "little",
                enumValues: [
                    {
                        value: "little",
                        label: "Младший вперед",
                    },
                    {
                        value: "big",
                        label: "Старший вперед",
                    },
                ],
            },
            order4: {
                type: "enum",
                label: "Порядок 4-х байт",
                default: "1-0 3-2",
                enumValues: [
                    {
                        value: "1-0 3-2",
                        label: "1-0 3-2",
                    },
                    {
                        value: "3-2 1-0",
                        label: "3-2 1-0",
                    },
                    {
                        value: "2-3 0-1",
                        label: "2-3 0-1",
                    },
                    {
                        value: "0-1 2-3",
                        label: "0-1 2-3",
                    },
                ],
            },
            pollPeriod: {
                type: "number",
                label: "Пауза между опросами, мс",
                default: 70,
            },
            waitResponse: {
                type: "boolean",
                label: "Ожидание ответа",
                default: true,
            },
        },
        children: [
            {
                node: "functionGroup",
                type: "protocolSpecific",
                label: "Функциональная группа",
                shortname: "fg",
                color: "orange",
                settings: {
                    function: {
                        type: "enum",
                        label: "Функция",
                        default: 1,
                        showInTree: true,
                        enumValues: [
                            {
                                label: "(0x01) Чтение значений из нескольких регистров флагов",
                                value: 1,
                            },
                            {
                                label: "(0x02) Чтение значений из нескольких дискретных входов",
                                value: 2,
                            },
                            {
                                label: "(0x03) Чтение значений из нескольких регистров хранения",
                                value: 3,
                            },
                            {
                                label: "(0x04) Чтение значений из нескольких регистров ввода",
                                value: 4,
                            },
                            {
                                label: "(0x05) Запись значения одного флага",
                                value: 5,
                            },
                            {
                                label: "(0x06) Запись значения в один регистр хранения",
                                value: 6,
                            },
                            {
                                label: "(0x15) Запись значений в несколько регистров флагов",
                                value: 15,
                            },
                            {
                                label: "(0x16) Запись значений в несколько регистров хранения",
                                value: 16,
                            },
                        ],
                    },
                    dataType: {
                        type: "enum",
                        label: "Тип данных",
                        showInTree: true,
                        enumValues: [
                            {
                                label: "1 бит - bool",
                                value: "bit",
                            },
                            {
                                label: "2 байта - целое без знака",
                                value: "ushort",
                            },
                            {
                                label: "2 байта - целое",
                                value: "short",
                            },
                            {
                                label: "4 байта - целое",
                                value: "int",
                            },
                            {
                                label: "4 байта - целое без знака",
                                value: "uint",
                            },
                            {
                                label: "4 байта - с плавающей точкой",
                                value: "float",
                            },
                        ],
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "mustBe",
                                params: ["bit"],
                                workIf: {
                                    or: [
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "function",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                1,
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "function",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                2,
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "function",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                15,
                                            ],
                                        },
                                    ],
                                },
                                message:
                                    "Данный тип данных не подходит для функций 1,2,15",
                            },
                            {
                                validator: "mustBe",
                                params: [
                                    "bit",
                                    "ushort",
                                    "short",
                                    "int",
                                    "uint",
                                    "float",
                                ],
                                workIf: {
                                    or: [
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "function",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                3,
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "function",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                4,
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "function",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                5,
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "function",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                16,
                                            ],
                                        },
                                    ],
                                },
                                message:
                                    "Данный тип данных не подходит для функций 3,4,5,16",
                            },
                            {
                                validator: "mustBe",
                                params: ["bit", "ushort", "short"],
                                workIf: {
                                    "==": [
                                        {
                                            find: [
                                                {
                                                    what: "function",
                                                    where: "self",
                                                },
                                            ],
                                        },
                                        6,
                                    ],
                                },
                                message:
                                    "Данный тип данных не подходит для функций 6",
                            },
                        ],
                    },
                },
                children: [
                    {
                        node: "dataObject",
                        type: "dataObject",
                        label: "Объект данных",
                        bulkCreation: {
                            enabled: true,
                            presets: [1, 2, 3, 5, 10],
                        },
                        icon: "fileDigit",
                        settings: {
                            address: {
                                type: "string",
                                label: "Адрес информационного объекта",
                                showInTree: true,
                                rules: [
                                    {
                                        validator: "required",
                                        message:
                                            "Это поле обязательно для заполнения",
                                    },
                                    {
                                        validator: "regex",
                                        params: {
                                            regex: "^0[xX][0-9a-fA-F]+$",
                                        },
                                        message:
                                            "Неверный формат адреса информационного объекта",
                                    },
                                    {
                                        validator: "range",
                                        params: { min: 0x0, max: 0xffff },
                                        message:
                                            "Значение должно быть в диапазоне от 0x0 до 0xffff",
                                    },
                                    {
                                        validator: "unique",
                                        params: {
                                            within: "ignoreFolder",
                                        },
                                        message:
                                            "Адрес должен быть уникальным внутри родительского элемента",
                                    },
                                ],
                            },
                        },
                    },
                    {
                        node: "folder",
                        type: "folder",
                        label: "Папка",
                        icon: "folder",
                    },
                ],
                validationRules: [
                    {
                        validator: "uniqueComposite",
                        params: {
                            within: "siblings",
                            fields: ["function", "dataType"],
                        },
                        message:
                            "Функция и тип данных должны быть уникальными внутри родительского элемента",
                    },
                ],
            },
        ],
    },
    {
        node: "modbusTCP_server",
        type: "protocol",
        label: "Modbus-TCP Сервер",
        usedIn: "send",
        shortname: "MB TCP",
        color: "red",
        settings: {
            logging: {
                type: "boolean",
                label: "Логирование",
                shortname: "log",
                default: false,
                showInTree: true,
            },
            ip: {
                type: "string",
                label: "IP-адрес",
                default: "127.0.0.1",
                showInTree: true,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "regex",
                        params: {
                            regex: "^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$",
                        },
                        message: "Неверный формат IP-адреса",
                    },
                ],
            },
            port: {
                type: "number",
                label: "Порт",
                default: 502,
                showInTree: true,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 65535,
                        },
                        message:
                            "Значение должно быть в диапазоне от 1 до 65535",
                    },
                ],
            },
            address: {
                type: "number",
                label: "Адрес устройства",
                default: 1,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 1,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 1 до 255",
                    },
                ],
            },
            order2: {
                type: "enum",
                label: "Порядок 2-х байт",
                default: "little",
                enumValues: [
                    {
                        value: "little",
                        label: "Младший вперед",
                    },
                    {
                        value: "big",
                        label: "Старший вперед",
                    },
                ],
            },
            order4: {
                type: "enum",
                label: "Порядок 4-х байт",
                default: "1-0 3-2",
                enumValues: [
                    {
                        value: "1-0 3-2",
                        label: "1-0 3-2",
                    },
                    {
                        value: "3-2 1-0",
                        label: "3-2 1-0",
                    },
                    {
                        value: "2-3 0-1",
                        label: "2-3 0-1",
                    },
                    {
                        value: "0-1 2-3",
                        label: "0-1 2-3",
                    },
                ],
            },
        },
        children: [
            {
                node: "functionGroup",
                type: "protocolSpecific",
                label: "Функциональная группа",
                shortname: "fg",
                color: "orange",
                settings: {
                    function: {
                        type: "enum",
                        label: "Функция",
                        default: 1,
                        showInTree: true,
                        enumValues: [
                            {
                                label: "(0x01) Чтение значений из нескольких регистров флагов",
                                value: 1,
                            },
                            {
                                label: "(0x02) Чтение значений из нескольких дискретных входов",
                                value: 2,
                            },
                            {
                                label: "(0x03) Чтение значений из нескольких регистров хранения",
                                value: 3,
                            },
                            {
                                label: "(0x04) Чтение значений из нескольких регистров ввода",
                                value: 4,
                            },
                            {
                                label: "(0x05) Запись значения одного флага",
                                value: 5,
                            },
                            {
                                label: "(0x06) Запись значения в один регистр хранения",
                                value: 6,
                            },
                            {
                                label: "(0x15) Запись значений в несколько регистров флагов",
                                value: 15,
                            },
                            {
                                label: "(0x16) Запись значений в несколько регистров хранения",
                                value: 16,
                            },
                        ],
                    },
                    dataType: {
                        type: "enum",
                        label: "Тип данных",
                        showInTree: true,
                        enumValues: [
                            {
                                label: "1 бит - bool",
                                value: "bit",
                            },
                            {
                                label: "2 байта - целое без знака",
                                value: "ushort",
                            },
                            {
                                label: "2 байта - целое",
                                value: "short",
                            },
                            {
                                label: "4 байта - целое",
                                value: "int",
                            },
                            {
                                label: "4 байта - целое без знака",
                                value: "uint",
                            },
                            {
                                label: "4 байта - с плавающей точкой",
                                value: "float",
                            },
                        ],
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "mustBe",
                                params: ["bit"],
                                workIf: {
                                    or: [
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "function",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                1,
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "function",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                2,
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "function",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                15,
                                            ],
                                        },
                                    ],
                                },
                                message:
                                    "Данный тип данных не подходит для функций 1,2,15",
                            },
                            {
                                validator: "mustBe",
                                params: [
                                    "bit",
                                    "ushort",
                                    "short",
                                    "int",
                                    "uint",
                                    "float",
                                ],
                                workIf: {
                                    or: [
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "function",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                3,
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "function",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                4,
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "function",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                5,
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "function",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                16,
                                            ],
                                        },
                                    ],
                                },
                                message:
                                    "Данный тип данных не подходит для функций 3,4,5,16",
                            },
                            {
                                validator: "mustBe",
                                params: ["bit", "ushort", "short"],
                                workIf: {
                                    "==": [
                                        {
                                            find: [
                                                {
                                                    what: "function",
                                                    where: "self",
                                                },
                                            ],
                                        },
                                        6,
                                    ],
                                },
                                message:
                                    "Данный тип данных не подходит для функций 6",
                            },
                        ],
                    },
                },
                children: [
                    {
                        node: "dataObject",
                        type: "dataObject",
                        label: "Объект данных",
                        bulkCreation: {
                            enabled: true,
                            presets: [1, 2, 3, 5, 10],
                        },
                        icon: "fileDigit",
                        settings: {
                            address: {
                                type: "string",
                                label: "Адрес информационного объекта",
                                showInTree: true,
                                rules: [
                                    {
                                        validator: "required",
                                        message:
                                            "Это поле обязательно для заполнения",
                                    },
                                    {
                                        validator: "regex",
                                        params: {
                                            regex: "^0[xX][0-9a-fA-F]+$",
                                        },
                                        message:
                                            "Неверный формат адреса информационного объекта",
                                    },
                                    {
                                        validator: "range",
                                        params: { min: 0x0, max: 0xffff },
                                        message:
                                            "Значение должно быть в диапазоне от 0x0 до 0xffff",
                                    },
                                    {
                                        validator: "unique",
                                        params: {
                                            within: "ignoreFolder",
                                        },
                                        message:
                                            "Адрес должен быть уникальным внутри родительского элемента",
                                    },
                                ],
                            },
                        },
                    },
                    {
                        node: "folder",
                        type: "folder",
                        label: "Папка",
                        icon: "folder",
                    },
                ],
                validationRules: [
                    {
                        validator: "uniqueComposite",
                        params: {
                            within: "siblings",
                            fields: ["function", "dataType"],
                        },
                        message:
                            "Функция и тип данных должны быть уникальными внутри родительского элемента",
                    },
                ],
            },
        ],
    },
    {
        node: "goose_pub",
        type: "protocol",
        label: "GOOSE Публикатор",
        usedIn: "send",
        shortname: "GOOSE pub",
        color: "red",
        settings: {
            logging: {
                type: "boolean",
                label: "Логирование",
                shortname: "log",
                default: false,
                showInTree: true,
            },
            name: {
                type: "string",
                label: "Имя подкючения",
                default: "goose_pub_1",
                showInTree: false,
            },
            lan: {
                type: "string",
                label: "LAN интерфейс",
                default: "eth0",
                showInTree: true,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                ],
            },
            mac5: {
                type: "string",
                label: "5 байт MAC-адреса",
                default: "00",
                showInTree: false,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 0,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 0 до 255",
                    },
                ],
            },
            mac6: {
                type: "string",
                label: "6 байт MAC-адреса",
                default: "00",
                showInTree: false,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 0,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 0 до 255",
                    },
                ],
            },
            appId: {
                type: "number",
                label: "APPID",
                default: 1,
                showInTree: false,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 0,
                            max: 65535,
                        },
                        message:
                            "Значение должно быть в диапазоне от 0 до 65535",
                    },
                ],
            },
            goCbRef: {
                type: "string",
                label: "goCbRef",
                default: "goose_pub_1",
                showInTree: false,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                ],
            },
            vlanId: {
                type: "number",
                label: "VLAN ID",
                default: 0,
                showInTree: false,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 0,
                            max: 65535,
                        },
                        message:
                            "Значение должно быть в диапазоне от 0 до 65535",
                    },
                ],
            },
            vlanPriority: {
                type: "number",
                label: "VLAN Priority",
                default: 4,
                showInTree: false,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 0,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 0 до 255",
                    },
                ],
            },
            revision: {
                type: "number",
                label: "Ревизия",
                default: 1,
                showInTree: false,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 0,
                            max: 4_294_967_295,
                        },
                        message:
                            "Значение должно быть в диапазоне от 0 до 4_294_967_295",
                    },
                ],
            },
            retry: {
                type: "number",
                label: "Количество повторов",
                default: 3,
                showInTree: false,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 0,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 0 до 255",
                    },
                ],
            },
            newMsgPeriod: {
                type: "number",
                label: "Период новых сообщений (мс)",
                default: 100,
                showInTree: false,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 0,
                            max: 65535,
                        },
                        message:
                            "Значение должно быть в диапазоне от 0 до 65535",
                    },
                ],
            },
            oldMsgPeriod: {
                type: "number",
                label: "Период старых сообщений (мс)",
                default: 100,
                showInTree: false,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 0,
                            max: 65535,
                        },
                        message:
                            "Значение должно быть в диапазоне от 0 до 65535",
                    },
                ],
            },
            ttl: {
                type: "number",
                label: "Время жизни (мс)",
                default: 3000,
                showInTree: false,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 0,
                            max: 4294_967_295,
                        },
                        message:
                            "Значение должно быть в диапазоне от 0 до 4_294_967_295",
                    },
                ],
            },
        },
        children: [
            {
                node: "dataSet",
                type: "protocolSpecific",
                label: "Набор данных",
                shortname: "ds",
                color: "orange",
                settings: {
                    dataSetRef: {
                        type: "string",
                        label: "Имя ссылки",
                        default: "ds1",
                        showInTree: false,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                        ],
                    },
                    countFlag: {
                        type: "boolean",
                        label: "Флаг количества",
                        default: false,
                        showInTree: false,
                    },
                    tsFlag: {
                        type: "boolean",
                        label: "Флаг метки времени",
                        default: false,
                        showInTree: false,
                    },
                    qIdx: {
                        type: "number",
                        label: "Индекс качества",
                        default: 1,
                        showInTree: false,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "range",
                                params: {
                                    min: 0,
                                    max: 2,
                                },
                                message:
                                    "Значение должно быть в диапазоне от 0 до 2",
                            },
                        ],
                    },
                    tsIdx: {
                        type: "number",
                        label: "Индекс метки времени",
                        default: 2,
                        showInTree: false,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "range",
                                params: {
                                    min: 0,
                                    max: 2,
                                },
                                message:
                                    "Значение должно быть в диапазоне от 0 до 2",
                            },
                        ],
                    },
                },
                children: [
                    {
                        node: "dataObject",
                        type: "dataObject",
                        label: "Объект данных",
                        bulkCreation: {
                            enabled: true,
                            presets: [1, 2, 3, 5, 10],
                        },
                        icon: "fileDigit",
                        settings: {
                            type: {
                                type: "enum",
                                label: "Тип данных",
                                enumValues: [
                                    {
                                        label: "1 бит - bool",
                                        value: "bit",
                                        min: 0,
                                        max: 1,
                                        step: 1,
                                        integer: true,
                                    },
                                    {
                                        label: "2 байта - целое без знака",
                                        value: "ushort",
                                        min: 0,
                                        max: 65535,
                                        step: 1,
                                        integer: true,
                                    },
                                    {
                                        label: "2 байта - целое",
                                        value: "short",
                                        min: -32768,
                                        max: 32767,
                                        step: 1,
                                        integer: true,
                                    },
                                    {
                                        label: "4 байта - целое",
                                        value: "int",
                                        min: -2147483648,
                                        max: 2147483647,
                                        step: 1,
                                        integer: true,
                                    },
                                    {
                                        label: "4 байта - целое без знака",
                                        value: "uint",
                                        min: 0,
                                        max: 4294967295,
                                        step: 1,
                                        integer: true,
                                    },
                                    {
                                        label: "4 байта - с плавающей точкой",
                                        value: "float",
                                        min: -3.402823466e38,
                                        max: 3.402823466e38,
                                        step: 0.1,
                                        integer: false,
                                        precision: 6,
                                    },
                                    {
                                        label: "Int64",
                                        value: "int64",
                                        step: 0.1,
                                        integer: false,
                                        precision: 6,
                                    },
                                    {
                                        label: "Bit string",
                                        value: "bitstring",
                                    },
                                ],
                                default: "bit",
                            },
                            valDeep: {
                                type: "number",
                                label: "Глубина вложенности значения",
                                default: 0,
                                rules: [
                                    {
                                        validator: "required",
                                        message:
                                            "Это поле обязательно для заполнения",
                                    },
                                    {
                                        validator: "range",
                                        params: {
                                            min: 0,
                                            max: 10,
                                        },
                                        message:
                                            "Значение должно быть в диапазоне от 0 до 10",
                                    },
                                ],
                            },
                            iusfMag: {
                                type: "boolean",
                                label: "IusfMag",
                                default: false,
                                visibleIf: {
                                    or: [
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "type",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                "bit",
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "type",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                "ushort",
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "type",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                "short",
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "type",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                "int",
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "type",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                "uint",
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "type",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                "float",
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    {
                        node: "structure",
                        type: "folder",
                        label: "Структура данных",
                    },
                ],
            },
        ],
    },
    {
        node: "goose_sub",
        type: "protocol",
        label: "GOOSE Подписчик",
        usedIn: "receive",
        shortname: "GOOSE sub",
        color: "red",
        settings: {
            logging: {
                type: "boolean",
                label: "Логирование",
                shortname: "log",
                default: false,
                showInTree: true,
            },
            name: {
                type: "string",
                label: "Имя подкючения",
                default: "goose_pub_1",
                showInTree: false,
            },
            lan: {
                type: "string",
                label: "LAN интерфейс",
                default: "eth0",
                showInTree: true,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                ],
            },
            mac5: {
                type: "string",
                label: "5 байт MAC-адреса",
                default: "00",
                showInTree: false,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 0,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 0 до 255",
                    },
                ],
            },
            mac6: {
                type: "string",
                label: "6 байт MAC-адреса",
                default: "00",
                showInTree: false,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 0,
                            max: 255,
                        },
                        message: "Значение должно быть в диапазоне от 0 до 255",
                    },
                ],
            },
            appId: {
                type: "number",
                label: "APPID",
                default: 1,
                showInTree: false,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                    {
                        validator: "range",
                        params: {
                            min: 0,
                            max: 65535,
                        },
                        message:
                            "Значение должно быть в диапазоне от 0 до 65535",
                    },
                ],
            },
            goCbRef: {
                type: "string",
                label: "goCbRef",
                default: "goose_pub_1",
                showInTree: false,
                rules: [
                    {
                        validator: "required",
                        message: "Это поле обязательно для заполнения",
                    },
                ],
            },
        },
        children: [
            {
                node: "dataSet",
                type: "protocolSpecific",
                label: "Набор данных",
                shortname: "ds",
                color: "orange",
                settings: {
                    dataSetRef: {
                        type: "string",
                        label: "Имя ссылки",
                        default: "ds1",
                        showInTree: false,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                        ],
                    },
                    qFlag: {
                        type: "boolean",
                        label: "Флаг качества",
                        default: true,
                        showInTree: false,
                    },
                    tsFlag: {
                        type: "boolean",
                        label: "Флаг метки времени",
                        default: false,
                        showInTree: false,
                    },
                    qIdx: {
                        type: "number",
                        label: "Индекс качества",
                        default: 1,
                        showInTree: false,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "range",
                                params: {
                                    min: 0,
                                    max: 2,
                                },
                                message:
                                    "Значение должно быть в диапазоне от 0 до 2",
                            },
                        ],
                    },
                    tsIdx: {
                        type: "number",
                        label: "Индекс метки времени",
                        default: 2,
                        showInTree: false,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "range",
                                params: {
                                    min: 0,
                                    max: 2,
                                },
                                message:
                                    "Значение должно быть в диапазоне от 0 до 2",
                            },
                        ],
                    },
                },
                children: [
                    {
                        node: "dataObject",
                        type: "dataObject",
                        label: "Объект данных",
                        bulkCreation: {
                            enabled: true,
                            presets: [1, 2, 3, 5, 10],
                        },
                        icon: "fileDigit",
                        settings: {
                            type: {
                                type: "enum",
                                label: "Тип данных",
                                enumValues: [
                                    {
                                        label: "1 бит - bool",
                                        value: "bit",
                                        min: 0,
                                        max: 1,
                                        step: 1,
                                        integer: true,
                                    },
                                    {
                                        label: "2 байта - целое без знака",
                                        value: "ushort",
                                        min: 0,
                                        max: 65535,
                                        step: 1,
                                        integer: true,
                                    },
                                    {
                                        label: "2 байта - целое",
                                        value: "short",
                                        min: -32768,
                                        max: 32767,
                                        step: 1,
                                        integer: true,
                                    },
                                    {
                                        label: "4 байта - целое",
                                        value: "int",
                                        min: -2147483648,
                                        max: 2147483647,
                                        step: 1,
                                        integer: true,
                                    },
                                    {
                                        label: "4 байта - целое без знака",
                                        value: "uint",
                                        min: 0,
                                        max: 4294967295,
                                        step: 1,
                                        integer: true,
                                    },
                                    {
                                        label: "4 байта - с плавающей точкой",
                                        value: "float",
                                        min: -3.402823466e38,
                                        max: 3.402823466e38,
                                        step: 0.1,
                                        integer: false,
                                        precision: 6,
                                    },
                                    {
                                        label: "Int64",
                                        value: "int64",
                                        step: 0.1,
                                        integer: false,
                                        precision: 6,
                                    },
                                    {
                                        label: "Bit string",
                                        value: "bitstring",
                                    },
                                ],
                                default: "bit",
                            },
                            valDeep: {
                                type: "number",
                                label: "Глубина вложенности значения",
                                default: 0,
                                rules: [
                                    {
                                        validator: "required",
                                        message:
                                            "Это поле обязательно для заполнения",
                                    },
                                    {
                                        validator: "range",
                                        params: {
                                            min: 0,
                                            max: 10,
                                        },
                                        message:
                                            "Значение должно быть в диапазоне от 0 до 10",
                                    },
                                ],
                            },
                            iusfMag: {
                                type: "boolean",
                                label: "IusfMag",
                                default: false,
                                visibleIf: {
                                    or: [
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "type",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                "bit",
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "type",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                "ushort",
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "type",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                "short",
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "type",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                "int",
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "type",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                "uint",
                                            ],
                                        },
                                        {
                                            "==": [
                                                {
                                                    find: [
                                                        {
                                                            what: "type",
                                                            where: "self",
                                                        },
                                                    ],
                                                },
                                                "float",
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    {
                        node: "structure",
                        type: "folder",
                        label: "Структура данных",
                    },
                ],
            },
        ],
    },
];
