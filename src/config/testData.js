export const receive = [
    {
        id: "1.1",
        type: "interface",
        subType: "rs485",
        name: "RS485",
        ignoreChildren: false,
        setting: {
            baudRate: "57600",
            pollPeriod: "21",
        },
        children: [
            {
                id: "1.1.1",
                type: "protocol",
                subType: "modbus-rtu",
                name: "modbus123",
                ignoreChildren: false,
                setting: {
                    logging: false,
                    deviceAddress: "1",
                    stopBit: "1",
                    parity: "None",
                    order2: "LittleEndian",
                    order4: "1-0 3-2",
                },
                children: [
                    {
                        id: "1.1.1.1",
                        type: "functionGroup", // функции из протокола modbus, по которым можно сгруппировать сигналы для опроса
                        name: "modbus123",
                        ignoreChildren: false,
                        setting: {
                            function: "4",
                            type: "1 бит – bool",
                        },
                        children: [
                            {
                                id: "1.1.1.1.1",
                                type: "dataObject",
                                name: "test2",
                                setting: {
                                    address: "2",
                                    variable: "test2",
                                    description: "",
                                },
                            },
                            {
                                id: "1.1.1.1.2",
                                type: "dataObject",
                                name: "new2",
                                setting: {
                                    address: "2",
                                    variable: "new2",
                                    description: "",
                                },
                            },
                            {
                                id: "1.1.1.1.3",
                                type: "dataObject",
                                name: "new2",
                                setting: {
                                    address: "2",
                                    variable: "new2",
                                    description: "",
                                },
                            },
                            {
                                id: "1.1.1.1.4",
                                type: "dataObject",
                                name: "new2",
                                setting: {
                                    address: "2",
                                    variable: "new2",
                                    description: "",
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: "1.2",
        type: "protocol",
        subType: "iec104",
        name: "iec12",
        ignoreChildren: false,
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
        children: [
            {
                id: "1.2.1",
                type: "asdu",
                name: "asdu1",
                ignoreChildren: false,
                setting: {
                    sporadical: false,
                    address: "1",
                    pollMode: "manual",
                    pollPeriod: "",
                },
                children: [
                    {
                        id: "1.2.1.1",
                        type: "dataObject",
                        variable: "test3",
                        setting: {
                            address: "12",
                            variable: "test3",
                            type: "Однопозиционный ТС",
                            aperture: null,
                            exec: "",
                            description: "",
                        },
                    },
                ],
            },
        ],
    },
    {
        id: "1.3",
        type: "protocol",
        subType: "gpio",
        name: "testName2GPIO",
        ignoreChildren: false,
        setting: {
            logging: false,
            contactBounce: "200",
        },
        children: [
            {
                id: "1.3.1",
                type: "folder",
                name: "folder0",
                ignoreChildren: false,
                /* setting: {
                    description: "TEST",
                    group: "bemp",
                    alias: "",
                    tags: [],
                }, */
                children: [
                    {
                        id: "1.3.1.1",
                        type: "dataObject",
                        name: "test1",
                        setting: {
                            address: "2",
                            variable: "test1",
                            function: "IN",
                            description: "",
                        },
                    },
                ],
            },
        ],
    },
];

export const variable = [
    {
        id: "3.1",
        type: "variable",
        name: "test1",
        setting: {
            isSpecial: true,
            type: "1 бит – bool",
            isLua: true,
            description: "Lorem ipsum dolor sit amet consectetur",
            cmd: true,
            archive: true,
            group: "Без группы",
            measurement: null,
            coefficient: "",
            luaExpression: "test2 = test2 + 1",
            specialCycleDelay: 5,
        },
    },
    {
        id: "3.2",
        type: "folder",
        name: "folder1",
        ignoreChildren: false,
        /* setting: {
            // Примерное содержимое
            description: "Эта папка нужна для тестирования",
            group: "bemp",
            alias: "",
            tags: [],
        }, */
        children: [
            {
                id: "3.2.2",
                type: "variable",
                name: "test2",
                setting: {
                    isSpecial: true,
                    type: "1 бит – bool",
                    isLua: true,
                    description: "Lorem ipsum dolor sit amet consectetur",
                    cmd: true,
                    archive: true,
                    group: "Без группы",
                    measurement: null,
                    coefficient: "",
                    luaExpression: "test2 = test2 + 1",
                    specialCycleDelay: 5,
                },
            },
            {
                id: "3.2.1",
                type: "folder",
                name: "folder2",
                ignoreChildren: false,
                /* setting: {
                    // Примерное содержимое
                    description: "Эта папка нужна для тестирования",
                    group: "bemp",
                    alias: "",
                    tags: [],
                }, */
                children: [
                    {
                        id: "3.2.1.1",
                        type: "variable",
                        name: "test3",
                        setting: {
                            isSpecial: true,
                            type: "1 бит – bool",
                            isLua: true,
                            description:
                                "Lorem ipsum dolor sit amet consectetur",
                            cmd: true,
                            archive: true,
                            group: "Без группы",
                            measurement: null,
                            coefficient: "",
                            luaExpression: "test2 = test2 + 1",
                            specialCycleDelay: 5,
                        },
                    },
                ],
            },
            {
                id: "3.2.4",
                type: "variable",
                name: "test9",
                setting: {
                    isSpecial: false,
                    type: "1 бит – bool",
                    isLua: true,
                    description: "Lorem ipsum dolor sit amet consectetur",
                    cmd: false,
                    archive: false,
                    group: "Без группы",
                    measurement: null,
                    coefficient: "",
                    luaExpression: "test2 = test2 + 1",
                    specialCycleDelay: 5,
                },
            },
            {
                id: "3.2.5",
                type: "variable",
                name: "test8",
                setting: {
                    isSpecial: true,
                    type: "1 бит – bool",
                    isLua: true,
                    description: "Lorem ipsum dolor sit amet consectetur",
                    cmd: true,
                    archive: true,
                    group: "Без группы",
                    measurement: null,
                    coefficient: "",
                    luaExpression: "test2 = test2 + 1",
                    specialCycleDelay: 5,
                },
            },
        ],
    },
];

export const send = receive;

export const config = {
    id: "0",
    type: "configuration",
    name: "Конфигурация для РЦДУ",
    ignoreChildren: false,
    setting: {
        description: "Конфигурация для РЦДУ",
        date: "2022-01-01 00:00",
        version: "1.0",
        hash: "SGVsbG8gd29ybGQh",
    },
    children: [
        {
            id: "1",
            type: "receive",
            name: "Получение данных",
            ignoreChildren: false,
            children: receive,
        },
        {
            id: "2",
            type: "send",
            name: "Отправка данных",
            ignoreChildren: false,
            children: [],
        },
        {
            id: "3",
            type: "variables",
            name: "Переменные",
            ignoreChildren: false,
            children: variable,
        },
    ],
};
