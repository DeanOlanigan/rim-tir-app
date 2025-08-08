// TODO Подумать над улучшением функционала контекстного меню
// TODO Подумать над необходимостью изменить описание параметров не мапой, а массивом объектов (чтобы был reorder)
export const testConfig = [
    {
        node: "folder",
        type: "folder",
        icon: { name: "folder" },
        label: "Папка",
    },
    {
        node: "comport",
        type: "interface",
        label: "Comport",
        shortName: "com",
        icon: { color: "blue", name: "cable" },
        settings: {
            iface: {
                type: "enum",
                label: "Интерфейс",
                default: "ttyS0",
                showInTree: true,
                enumValues: [
                    { value: "ttyS0", label: "ttyS0" },
                    { value: "ttyS1", label: "ttyS1" },
                ],
            },
            baudRate: {
                type: "enum",
                label: "Скорость",
                default: 115200,
                enumValues: [
                    { value: 19200, label: "19200" },
                    { value: 38400, label: "38400" },
                    { value: 57600, label: "57600" },
                    { value: 115200, label: "115200" },
                    { value: 230400, label: "230400" },
                ],
            },
            stopBit: {
                type: "enum",
                label: "Стоп-бит",
                default: 1,
                enumValues: [
                    { value: 1, label: "1" },
                    { value: 2, label: "2" },
                ],
            },
            parity: {
                type: "enum",
                label: "Паритет",
                default: "none",
                enumValues: [
                    { value: "none", label: "Нет" },
                    { value: "even", label: "Бит чётности" },
                    { value: "odd", label: "Бит нечётности" },
                ],
            },
        },
        usedIn: "both",
        children: [
            {
                node: "modbusRTU",
                type: "protocol",
                label: "Modbus-RTU",
                shortName: "Mb-RTU",
                icon: { color: "purple", name: "unplug" },
                settings: {
                    logging: {
                        type: "boolean",
                        label: "Логирование",
                        default: false,
                        showInTree: false,
                    },
                    role: {
                        type: "enum",
                        label: "Роль",
                        default: "master",
                        showInTree: false,
                        enumValues: [
                            { value: "master", label: "Master" },
                            { value: "slave", label: "Slave" },
                        ],
                    },
                    address: {
                        type: "number",
                        label: "Адрес устройства",
                        default: 1,
                        showInTree: false,
                        rules: [
                            {
                                validator: "required",
                                message: "Это поле обязательно для заполнения",
                            },
                            {
                                validator: "range",
                                params: { min: 1, max: 255 },
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
                        showInTree: true,
                        enumValues: [
                            { value: "1-0 3-2", label: "1-0 3-2" },
                            { value: "3-2 1-0", label: "3-2 1-0" },
                            { value: "2-3 0-1", label: "2-3 0-1" },
                            { value: "0-1 2-3", label: "0-1 2-3" },
                        ],
                    },
                    pause: {
                        type: "number",
                        label: "Пауза между запросами, мс",
                        default: 50,
                    },
                },
                usedIn: "receive",
                children: [
                    {
                        node: "functionGroup",
                        type: "protocolSpecific",
                        label: "Функциональная группа",
                        icon: { color: "green", name: "unplug" },
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
                                        default: "",
                                        rules: [
                                            {
                                                validator: "required",
                                                message:
                                                    "Это поле обязательно для заполнения",
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
                node: "tcpBridge",
                type: "interfaceSpecific",
                label: "TCP-мост",
                icon: { name: "lrEllipsis" },
                settings: {
                    logging: {
                        type: "boolean",
                        label: "Логирование",
                        default: false,
                    },
                    side: {
                        type: "enum",
                        label: "Тип",
                        default: "client",
                        enumValues: [
                            { label: "Клиент", value: "client" },
                            { label: "Сервер", value: "server" },
                        ],
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
                                params: { min: 1, max: 65535 },
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
                                params: { min: 0, max: 255 },
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
                                params: { min: 0, max: 255 },
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
        node: "modbusTCP",
        type: "protocol",
        label: "Modbus-TCP",
        icon: { name: "unplug" },
        settings: {
            logging: {
                type: "boolean",
                label: "Логирование",
                default: false,
            },
            side: {
                type: "enum",
                label: "Сторона",
                default: "client",
                enumValues: [
                    { value: "client", label: "Клиент" },
                    { value: "server", label: "Сервер" },
                ],
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
                        params: { min: 1, max: 65535 },
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
                        params: { min: 1, max: 255 },
                        message: "Значение должно быть в диапазоне от 1 до 255",
                    },
                ],
            },
            order2: {
                type: "enum",
                label: "Порядок 2-х байт",
                default: "little",
                enumValues: [
                    { value: "little", label: "Младший вперед" },
                    { value: "big", label: "Старший вперед" },
                ],
            },
            order4: {
                type: "enum",
                label: "Порядок 4-х байт",
                default: "1-0 3-2",
                enumValues: [
                    { value: "1-0 3-2", label: "1-0 3-2" },
                    { value: "3-2 1-0", label: "3-2 1-0" },
                    { value: "2-3 0-1", label: "2-3 0-1" },
                    { value: "0-1 2-3", label: "0-1 2-3" },
                ],
            },
            pollPeriod: {
                type: "number",
                label: "Период опроса, мс",
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
                        default: "bit",
                        enumValues: [
                            { label: "1 бит - bool", value: "bit" },
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
                        icon: { name: "variable" },
                        settings: {
                            address: {
                                type: "string",
                                label: "Адрес информационного объекта",
                                default: "",
                                rules: [
                                    {
                                        validator: "required",
                                        message:
                                            "Это поле обязательно для заполнения",
                                    },
                                    {
                                        validator: "unique",
                                        params: { within: "siblings" },
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
        node: "gpio",
        type: "interface",
        label: "GPIO",
        icon: { name: "cable" },
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
                        params: { min: 1, max: 10000 },
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
                icon: { name: "fileDigit" },
                settings: {
                    port: {
                        type: "enum",
                        label: "Порт",
                        default: 1,
                        enumValues: [
                            { label: "1", value: 1 },
                            { label: "2", value: 2 },
                            { label: "3", value: 3 },
                            { label: "4", value: 4 },
                            { label: "5", value: 5 },
                            { label: "6", value: 6 },
                            { label: "7", value: 7 },
                        ],
                    },
                    function: {
                        type: "enum",
                        label: "Функция",
                        default: "input",
                        enumValues: [
                            { label: "Вход", value: "input" },
                            { label: "Выход", value: "output" },
                        ],
                    },
                },
            },
            {
                node: "folder",
                type: "folder",
                label: "Папка",
                icon: { name: "folder" },
                settings: {
                    test: {
                        type: "boolean",
                        label: "Тест",
                        default: false,
                    },
                },
            },
        ],
    },
    {
        node: "iec104",
        type: "protocol",
        label: "IEC 104",
        shortName: "iec104",
        settings: {
            logging: {
                type: "boolean",
                label: "Логирование",
                default: false,
            },
            side: {
                type: "enum",
                label: "Тип",
                default: "client",
                enumValues: [
                    { label: "Клиент", value: "client" },
                    { label: "Сервер", value: "server" },
                ],
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
                        params: { min: 1, max: 65535 },
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
                    { label: "1 байт", value: 1 },
                    { label: "2 байта", value: 2 },
                ],
            },
            lengthOfCause: {
                type: "enum",
                label: "Длина причины передачи",
                default: 1,
                enumValues: [
                    { label: "1 байт", value: 1 },
                    { label: "2 байта", value: 2 },
                ],
            },
            lengthOfAdr: {
                type: "enum",
                label: "Длина адреса объекта",
                default: 1,
                enumValues: [
                    { label: "1 байт", value: 1 },
                    { label: "2 байта", value: 2 },
                    { label: "3 байта", value: 3 },
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
                        params: { min: 1, max: 255 },
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
                        params: { min: 1, max: 255 },
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
                        params: { min: 1, max: 255 },
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
                        params: { min: 1, max: 255 },
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
                        params: { min: 1, max: 255 },
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
                        params: { min: 1, max: 255 },
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
                                params: { min: 1, max: 65535 },
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
                                params: { min: 1, max: 255 },
                                message:
                                    "Значение должно быть в диапазоне от 1 до 255",
                            },
                            {
                                validator: "unique",
                                params: { within: "siblings" },
                                message:
                                    "Адрес должен быть уникальным внутри родительского элемента",
                            },
                        ],
                    },
                    sporadical: {
                        type: "boolean",
                        label: "Спорадический",
                        default: false,
                        visibleIf: {
                            "==": [
                                {
                                    find: [
                                        {
                                            what: "side",
                                            where: "parent",
                                        },
                                    ],
                                },
                                "server",
                            ],
                        },
                    },
                    pollMode: {
                        label: "Режим опроса",
                        type: "enum",
                        default: "manual",
                        enumValues: [
                            { label: "Ручной", value: "manual" },
                            {
                                label: "На старте",
                                value: "onStart",
                            },
                            { label: "Всегда", value: "always" },
                            { label: "Без опроса", value: "noPoll" },
                        ],
                        visibleIf: {
                            "==": [
                                {
                                    find: [
                                        {
                                            what: "side",
                                            where: "parent",
                                        },
                                    ],
                                },
                                "server",
                            ],
                        },
                    },
                    pollPeriod: {
                        type: "number",
                        label: "Период опроса, мин.",
                        default: 1,
                        visibleIf: {
                            and: [
                                {
                                    "==": [
                                        {
                                            find: [
                                                {
                                                    what: "side",
                                                    where: "parent",
                                                },
                                            ],
                                        },
                                        "server",
                                    ],
                                },
                                {
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
                            ],
                        },
                        rules: [
                            {
                                validator: "range",
                                params: { min: 1, max: 255 },
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
                        icon: { name: "variable" },
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
                                        params: { min: 0, max: 255 },
                                        workIf: {
                                            "==": [
                                                {
                                                    find: {
                                                        what: "lengthOfAdr",
                                                        where: "parent",
                                                    },
                                                },
                                                1,
                                            ],
                                        },
                                        message:
                                            "Значение должно быть в диапазоне от 0 до 255",
                                    },
                                    {
                                        validator: "range",
                                        params: { min: 0, max: 16777215 },
                                        workIf: {
                                            "==": [
                                                {
                                                    find: {
                                                        what: "lengthOfAdr",
                                                        where: "parent",
                                                    },
                                                },
                                                3,
                                            ],
                                        },
                                        message:
                                            "Значение должно быть в диапазоне от 0 до 16777215",
                                    },
                                    {
                                        validator: "range",
                                        params: { min: 0, max: 65535 },
                                        message:
                                            "Значение должно быть в диапазоне от 0 до 65535",
                                    },
                                    {
                                        validator: "unique",
                                        params: { within: "siblings" },
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
                                    and: [
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
                            },
                            exec: {
                                type: "enum",
                                label: "Команда",
                                default: "direct",
                                enumValues: [
                                    { label: "Прямое", value: "direct" },
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
        node: "gooseSub",
        type: "protocol",
        label: "GOOSE-подписчик",
        icon: { name: "goose" },
        usedIn: "receive",
        settings: {
            iface: {
                type: "string",
                label: "lan интерфейс",
                default: "eth0",
            },
            updatePeriod: {
                type: "number",
                label: "Период обновления, мс",
                default: 100,
            },
        },
        children: [
            {
                node: "dataSet",
                type: "protocolSpecific",
                label: "Набор данных",
                usedIn: "receive",
                settings: {
                    goCBRef: {
                        type: "string",
                        label: "Ссылка goCBRef",
                        default: "",
                    },
                    appid: {
                        type: "number",
                        label: "appid",
                        default: 0,
                        rules: [
                            {
                                validator: "range",
                                params: { min: 0, max: 65535 },
                                message:
                                    "Значение должно быть в диапазоне от 0 до 65535",
                            },
                        ],
                    },
                },
                children: [
                    {
                        node: "array",
                        type: "folder",
                        usedIn: "receive",
                        label: "Массив набора данных",
                    },
                    {
                        node: "dataObject",
                        type: "dataObject",
                        label: "Объект данных",
                        bulkCreation: {
                            enabled: true,
                            presets: [1, 2, 3, 5, 10],
                        },
                        usedIn: "receive",
                        settings: {
                            index: {
                                type: "number",
                                label: "индекс",
                                default: 0,
                            },
                            type: {
                                type: "enum",
                                label: "Тип объекта данных",
                                default: "ts",
                                enumValues: [
                                    { label: "ТС", value: "ts" },
                                    { label: "ТИ", value: "ti" },
                                ],
                            },
                            stValIdx: {
                                type: "number",
                                label: "Индекс значения",
                                default: 0,
                            },
                            qIdx: {
                                type: "number",
                                label: "Индекс качества",
                                default: 0,
                            },
                            tIdx: {
                                type: "number",
                                label: "Индекс времени",
                                default: 0,
                            },
                            aperture: {
                                type: "number",
                                label: "Апертура",
                                default: 0,
                                visibleIf: {
                                    "==": [
                                        {
                                            find: [
                                                {
                                                    what: "type",
                                                    where: "self",
                                                },
                                            ],
                                        },
                                        "ti",
                                    ],
                                },
                            },
                            debounce: {
                                type: "number",
                                label: "Дребезг",
                                default: 0,
                                visibleIf: {
                                    "==": [
                                        {
                                            find: [
                                                {
                                                    what: "type",
                                                    where: "self",
                                                },
                                            ],
                                        },
                                        "ts",
                                    ],
                                },
                            },
                            dataType: {
                                type: "enum",
                                label: "Тип",
                                default: 1,
                                enumValues: [
                                    { label: "1 бит", value: 1 },
                                    { label: "2 бит", value: 2 },
                                ],
                                visibleIf: {
                                    "==": [
                                        {
                                            find: [
                                                {
                                                    what: "type",
                                                    where: "self",
                                                },
                                            ],
                                        },
                                        "ts",
                                    ],
                                },
                            },
                        },
                        icon: { name: "variable" },
                    },
                ],
            },
            {
                node: "folder",
                type: "folder",
                usedIn: "receive",
                label: "Папка",
            },
        ],
    },
    {
        node: "goosePub",
        type: "protocol",
        label: "GOOSE-публикатор",
        icon: { color: "purple", name: "goose" },
        usedIn: "send",
        settings: {
            iface: {
                type: "string",
                label: "lan интерфейс",
                default: "eth0",
            },
            appid: {
                type: "number",
                label: "appid",
                default: 0,
                showInTree: true,
            },
            vlanid: {
                type: "number",
                label: "Идентификатор VLAN",
                default: 0,
            },
            vlanPriority: {
                type: "number",
                label: "Приоритет VLAN",
                default: 0,
            },
            macByte5: {
                type: "number",
                label: "5 байт MAC-адреса",
                default: 0,
            },
            macByte6: {
                type: "number",
                label: "6 байт MAC-адреса",
                default: 0,
            },
            repeatsNewCount: {
                type: "number",
                label: "Кол-во повторов новых данных",
                default: 0,
            },
            repeatsNewTime: {
                type: "number",
                label: "Период повтора новых данных",
                default: 0,
            },
            repeatsOldTime: {
                type: "number",
                label: "Период повтора старых данных",
                default: 0,
            },
            updatePeriod: {
                type: "number",
                label: "Период обновления, мс",
                default: 100,
            },
        },
        children: [
            {
                node: "dataSet",
                type: "protocolSpecific",
                label: "Набор данных",
                settings: {
                    goCBRef: {
                        type: "string",
                        label: "Ссылка goCBRef",
                        default: "",
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
                        settings: {
                            type: {
                                type: "enum",
                                label: "Тип объекта данных",
                                default: "ts",
                                enumValues: [
                                    { label: "ТС, булевое", value: "ts" },
                                    { label: "ТС2", value: "ts2" },
                                    {
                                        label: "4 байта, целое",
                                        value: "int32",
                                    },
                                    {
                                        label: "8 байт, целое",
                                        value: "int64",
                                    },
                                    {
                                        label: "4 байта, вещественное",
                                        value: "float",
                                    },
                                    {
                                        label: "8 байт, вещественное",
                                        value: "double",
                                    },
                                ],
                            },
                        },
                        icon: { name: "variable" },
                    },
                ],
            },
            {
                node: "folder",
                type: "folder",
                label: "Папка",
            },
        ],
    },
];
