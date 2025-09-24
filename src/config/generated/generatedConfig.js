/**
 * Сгенерировано build-test-config.js
 * НЕ редактируй вручную!
 */
export const config = [
    {
        node: "folder",
        type: "folder",
        label: "Папка",
    },
    {
        node: "comport",
        type: "interface",
        label: "Comport",
        icon: {
            color: "blue",
            name: "cable",
        },
        usedIn: "both",
        settings: {
            iface: {
                type: "enum",
                label: "Интерфейс",
                default: "ttyS0",
                showInTree: true,
                enumValues: [
                    {
                        value: "ttyS0",
                        label: "ttyS0",
                    },
                    {
                        value: "ttyS1",
                        label: "ttyS1",
                    },
                ],
            },
            baudRate: {
                type: "enum",
                label: "Скорость",
                default: 115200,
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
                icon: {
                    name: "unplug",
                    color: "purple",
                },
                usedIn: "receive",
                settings: {
                    logging: {
                        type: "boolean",
                        label: "Логирование",
                        showInTree: true,
                        default: false,
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
                        icon: {
                            name: "unplug",
                            color: "green",
                        },
                        settings: {
                            function: {
                                type: "enum",
                                label: "Функция",
                                showInTree: true,
                                default: 1,
                                enumValues: [
                                    {
                                        label: "Чтение значений из нескольких регистров флагов (0x01)",
                                        value: 1,
                                    },
                                    {
                                        label: "Чтение значений из нескольких дискретных входов (0x02)",
                                        value: 2,
                                    },
                                    {
                                        label: "Чтение значений из нескольких регистров хранения (0x03)",
                                        value: 3,
                                    },
                                    {
                                        label: "Чтение значений из нескольких регистров ввода (0x04)",
                                        value: 4,
                                    },
                                    {
                                        label: "Запись значения одного флага (0x05)",
                                        value: 5,
                                    },
                                    {
                                        label: "Запись значения в один регистр хранения (0x06)",
                                        value: 6,
                                    },
                                    {
                                        label: "Запись значений в несколько регистров флагов (0x15)",
                                        value: 15,
                                    },
                                    {
                                        label: "Запись значений в несколько регистров хранения (0x16)",
                                        value: 16,
                                    },
                                ],
                            },
                            dataType: {
                                type: "enum",
                                label: "Тип данных",
                                default: "bit",
                                enumValues: [
                                    {
                                        label: "1 бит - bool",
                                        value: "bit",
                                    },
                                    {
                                        label: "2 байта - целое без знака",
                                        value: "twoByteUnsigned",
                                    },
                                    {
                                        label: "2 байта - целое",
                                        value: "twoByteSigned",
                                    },
                                    {
                                        label: "4 байта - целое",
                                        value: "fourByteSigned",
                                    },
                                    {
                                        label: "4 байта - целое без знака",
                                        value: "fourByteUnsigned",
                                    },
                                    {
                                        label: "4 байта - с плавающей точкой",
                                        value: "fourByteFloat",
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
                                            "twoByteUnsigned",
                                            "twoByteSigned",
                                            "fourByteSigned",
                                            "fourByteUnsigned",
                                            "fourByteFloat",
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
                                        params: [
                                            "bit",
                                            "twoByteUnsigned",
                                            "twoByteSigned",
                                        ],
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
                                icon: {
                                    name: "variable",
                                },
                                settings: {
                                    address: {
                                        type: "string",
                                        label: "Адрес информационного объекта",
                                        pref: "hex",
                                        showInTree: true,
                                        default: "",
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
                icon: {
                    name: "unplug",
                    color: "purple",
                },
                usedIn: "send",
                settings: {
                    logging: {
                        type: "boolean",
                        label: "Логирование",
                        showInTree: true,
                        default: false,
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
                        icon: {
                            name: "unplug",
                            color: "green",
                        },
                        settings: {
                            function: {
                                type: "enum",
                                label: "Функция",
                                showInTree: true,
                                default: 1,
                                enumValues: [
                                    {
                                        label: "Чтение значений из нескольких регистров флагов (0x01)",
                                        value: 1,
                                    },
                                    {
                                        label: "Чтение значений из нескольких дискретных входов (0x02)",
                                        value: 2,
                                    },
                                    {
                                        label: "Чтение значений из нескольких регистров хранения (0x03)",
                                        value: 3,
                                    },
                                    {
                                        label: "Чтение значений из нескольких регистров ввода (0x04)",
                                        value: 4,
                                    },
                                    {
                                        label: "Запись значения одного флага (0x05)",
                                        value: 5,
                                    },
                                    {
                                        label: "Запись значения в один регистр хранения (0x06)",
                                        value: 6,
                                    },
                                    {
                                        label: "Запись значений в несколько регистров флагов (0x15)",
                                        value: 15,
                                    },
                                    {
                                        label: "Запись значений в несколько регистров хранения (0x16)",
                                        value: 16,
                                    },
                                ],
                            },
                            dataType: {
                                type: "enum",
                                label: "Тип данных",
                                default: "bit",
                                enumValues: [
                                    {
                                        label: "1 бит - bool",
                                        value: "bit",
                                    },
                                    {
                                        label: "2 байта - целое без знака",
                                        value: "twoByteUnsigned",
                                    },
                                    {
                                        label: "2 байта - целое",
                                        value: "twoByteSigned",
                                    },
                                    {
                                        label: "4 байта - целое",
                                        value: "fourByteSigned",
                                    },
                                    {
                                        label: "4 байта - целое без знака",
                                        value: "fourByteUnsigned",
                                    },
                                    {
                                        label: "4 байта - с плавающей точкой",
                                        value: "fourByteFloat",
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
                                            "twoByteUnsigned",
                                            "twoByteSigned",
                                            "fourByteSigned",
                                            "fourByteUnsigned",
                                            "fourByteFloat",
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
                                        params: [
                                            "bit",
                                            "twoByteUnsigned",
                                            "twoByteSigned",
                                        ],
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
                                icon: {
                                    name: "variable",
                                },
                                settings: {
                                    address: {
                                        type: "string",
                                        label: "Адрес информационного объекта",
                                        pref: "hex",
                                        showInTree: true,
                                        default: "",
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
                usedIn: "receive",
                icon: {
                    name: "lrEllipsis",
                    color: "black",
                },
                settings: {
                    logging: {
                        type: "boolean",
                        label: "Логирование",
                        default: false,
                    },
                    ip: {
                        type: "string",
                        label: "IP-адрес",
                        default: "127.0.0.1",
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
                usedIn: "send",
                icon: {
                    name: "lrEllipsis",
                    color: "black",
                },
                settings: {
                    logging: {
                        type: "boolean",
                        label: "Логирование",
                        default: false,
                    },
                    ip: {
                        type: "string",
                        label: "IP-адрес",
                        default: "127.0.0.1",
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
        icon: {
            name: "cable",
        },
        settings: {
            logging: {
                type: "boolean",
                label: "Логирование",
                default: false,
            },
            contactBounce: {
                type: "number",
                label: "Период дребезга",
                default: 200,
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
                icon: {
                    name: "fileDigit",
                },
                settings: {
                    port: {
                        type: "enum",
                        label: "Порт",
                        showInTree: true,
                        default: 1,
                        enumValues: [
                            {
                                label: "1",
                                value: 1,
                            },
                            {
                                label: "2",
                                value: 2,
                            },
                            {
                                label: "3",
                                value: 3,
                            },
                            {
                                label: "4",
                                value: 4,
                            },
                            {
                                label: "5",
                                value: 5,
                            },
                            {
                                label: "6",
                                value: 6,
                            },
                            {
                                label: "7",
                                value: 7,
                            },
                        ],
                    },
                    function: {
                        type: "enum",
                        label: "Функция",
                        showInTree: true,
                        default: "input",
                        enumValues: [
                            {
                                label: "Вход",
                                value: "input",
                            },
                            {
                                label: "Выход",
                                value: "output",
                            },
                        ],
                    },
                },
            },
            {
                node: "folder",
                type: "folder",
                label: "Папка",
            },
        ],
    },
    {
        node: "iec104_client",
        type: "interface",
        label: "IEC-104 Клиент",
        usedIn: "receive",
        settings: {
            logging: {
                type: "boolean",
                label: "Логирование",
                default: false,
            },
            ip: {
                type: "string",
                label: "IP-адрес",
                default: "127.0.0.1",
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
                settings: {
                    address: {
                        type: "number",
                        label: "Адрес ASDU",
                        default: 0,
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
                        icon: {
                            name: "variable",
                            color: "black",
                        },
                        settings: {
                            address: {
                                type: "number",
                                label: "Адрес информационного объекта",
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
                                default: "ts_one_position",
                                enumValues: [
                                    {
                                        label: "Однопозиционный ТС",
                                        value: "ts_one_position",
                                    },
                                    {
                                        label: "Двухпозиционный ТС",
                                        value: "ts_two_position",
                                    },
                                    {
                                        label: "ТИ масштабированное",
                                        value: "ti_scaled",
                                    },
                                    {
                                        label: "ТИ нормализованное",
                                        value: "ti_normalized",
                                    },
                                    {
                                        label: "ТИ с плавающей точкой ",
                                        value: "ti_float",
                                    },
                                    {
                                        label: "Однопозиционное ТУ",
                                        value: "tu_one_position",
                                    },
                                    {
                                        label: "Двухпозиционное ТУ",
                                        value: "tu_two_position",
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
                                                "tu_one_position",
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
                                                "tu_two_position",
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
                    },
                ],
            },
        ],
    },
    {
        node: "iec104_server",
        type: "interface",
        label: "IEC-104 Сервер",
        usedIn: "send",
        settings: {
            logging: {
                type: "boolean",
                label: "Логирование",
                default: false,
            },
            ip: {
                type: "string",
                label: "IP-адрес",
                default: "127.0.0.1",
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
                settings: {
                    sporadical: {
                        type: "boolean",
                        label: "Спорадика",
                        default: false,
                    },
                    address: {
                        type: "number",
                        label: "Адрес ASDU",
                        default: 0,
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
                        icon: {
                            name: "variable",
                            color: "black",
                        },
                        settings: {
                            address: {
                                type: "number",
                                label: "Адрес информационного объекта",
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
                                default: "ts_one_position",
                                enumValues: [
                                    {
                                        label: "Однопозиционный ТС",
                                        value: "ts_one_position",
                                    },
                                    {
                                        label: "Двухпозиционный ТС",
                                        value: "ts_two_position",
                                    },
                                    {
                                        label: "ТИ масштабированное",
                                        value: "ti_scaled",
                                    },
                                    {
                                        label: "ТИ нормализованное",
                                        value: "ti_normalized",
                                    },
                                    {
                                        label: "ТИ с плавающей точкой ",
                                        value: "ti_float",
                                    },
                                    {
                                        label: "Однопозиционное ТУ",
                                        value: "tu_one_position",
                                    },
                                    {
                                        label: "Двухпозиционное ТУ",
                                        value: "tu_two_position",
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
                                                        "ti_scaled",
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
                                                        "ti_normalized",
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
                                                        "ti_float",
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
                                                "tu_one_position",
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
                                                "tu_two_position",
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
        icon: {
            name: "unplug",
        },
        settings: {
            logging: {
                type: "boolean",
                label: "Логирование",
                default: false,
            },
            ip: {
                type: "string",
                label: "IP-адрес",
                default: "127.0.0.1",
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
                settings: {
                    function: {
                        type: "enum",
                        label: "Функция",
                        default: 1,
                        enumValues: [
                            {
                                label: "Чтение значений из нескольких регистров флагов (0x01)",
                                value: 1,
                            },
                            {
                                label: "Чтение значений из нескольких дискретных входов (0x02)",
                                value: 2,
                            },
                            {
                                label: "Чтение значений из нескольких регистров хранения (0x03)",
                                value: 3,
                            },
                            {
                                label: "Чтение значений из нескольких регистров ввода (0x04)",
                                value: 4,
                            },
                            {
                                label: "Запись значения одного флага (0x05)",
                                value: 5,
                            },
                            {
                                label: "Запись значения в один регистр хранения (0x06)",
                                value: 6,
                            },
                            {
                                label: "Запись значений в несколько регистров флагов (0x15)",
                                value: 15,
                            },
                            {
                                label: "Запись значений в несколько регистров хранения (0x16)",
                                value: 16,
                            },
                        ],
                    },
                    dataType: {
                        type: "enum",
                        label: "Тип данных",
                        default: "",
                        enumValues: [
                            {
                                label: "1 бит - bool",
                                value: "bit",
                            },
                            {
                                label: "2 байта - целое без знака",
                                value: "twoByteUnsigned",
                            },
                            {
                                label: "2 байта - целое",
                                value: "twoByteSigned",
                            },
                            {
                                label: "4 байта - целое",
                                value: "fourByteSigned",
                            },
                            {
                                label: "4 байта - целое без знака",
                                value: "fourByteUnsigned",
                            },
                            {
                                label: "4 байта - с плавающей точкой",
                                value: "fourByteFloat",
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
                                    "twoByteUnsigned",
                                    "twoByteSigned",
                                    "fourByteSigned",
                                    "fourByteUnsigned",
                                    "fourByteFloat",
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
                                params: [
                                    "bit",
                                    "twoByteUnsigned",
                                    "twoByteSigned",
                                ],
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
                        icon: {
                            name: "variable",
                        },
                        settings: {
                            address: {
                                type: "string",
                                label: "Адрес информационного объекта",
                                pref: "hex",
                                default: "",
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
        icon: {
            name: "unplug",
        },
        settings: {
            logging: {
                type: "boolean",
                label: "Логирование",
                default: false,
            },
            ip: {
                type: "string",
                label: "IP-адрес",
                default: "127.0.0.1",
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
                settings: {
                    function: {
                        type: "enum",
                        label: "Функция",
                        default: 1,
                        enumValues: [
                            {
                                label: "Чтение значений из нескольких регистров флагов (0x01)",
                                value: 1,
                            },
                            {
                                label: "Чтение значений из нескольких дискретных входов (0x02)",
                                value: 2,
                            },
                            {
                                label: "Чтение значений из нескольких регистров хранения (0x03)",
                                value: 3,
                            },
                            {
                                label: "Чтение значений из нескольких регистров ввода (0x04)",
                                value: 4,
                            },
                            {
                                label: "Запись значения одного флага (0x05)",
                                value: 5,
                            },
                            {
                                label: "Запись значения в один регистр хранения (0x06)",
                                value: 6,
                            },
                            {
                                label: "Запись значений в несколько регистров флагов (0x15)",
                                value: 15,
                            },
                            {
                                label: "Запись значений в несколько регистров хранения (0x16)",
                                value: 16,
                            },
                        ],
                    },
                    dataType: {
                        type: "enum",
                        label: "Тип данных",
                        default: "",
                        enumValues: [
                            {
                                label: "1 бит - bool",
                                value: "bit",
                            },
                            {
                                label: "2 байта - целое без знака",
                                value: "twoByteUnsigned",
                            },
                            {
                                label: "2 байта - целое",
                                value: "twoByteSigned",
                            },
                            {
                                label: "4 байта - целое",
                                value: "fourByteSigned",
                            },
                            {
                                label: "4 байта - целое без знака",
                                value: "fourByteUnsigned",
                            },
                            {
                                label: "4 байта - с плавающей точкой",
                                value: "fourByteFloat",
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
                                    "twoByteUnsigned",
                                    "twoByteSigned",
                                    "fourByteSigned",
                                    "fourByteUnsigned",
                                    "fourByteFloat",
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
                                params: [
                                    "bit",
                                    "twoByteUnsigned",
                                    "twoByteSigned",
                                ],
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
                        icon: {
                            name: "variable",
                        },
                        settings: {
                            address: {
                                type: "string",
                                label: "Адрес информационного объекта",
                                pref: "hex",
                                default: "",
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
];
