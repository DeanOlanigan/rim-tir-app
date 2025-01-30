export const testData = {
    "variables": {
        "variable": [
            {
                "-id": "1",
                "-isSpecial": true,
                "-name": "test1",
                "-type": "1 бит – bool",
                "-isLua": true,
                "-description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sit iure ea, odit nemo nobis non qua Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sit iure ea, odit nemo nobis non qua Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sit iure ea, odit nemo nobis non qua",
                "-cmd": true,
                "-archive": true,
                "-group": "Без группы",
                "-measurement": null,
                "-coefficient": "",
                "-luaExpression": "test2 = test2 + 1",
                "-specialCycleDelay": 5
            },
            {
                "-id": "2",
                "-isSpecial": false,
                "-name": "test2test2test2test2test2",
                "-type": "2 байта – целое",
                "-isLua": true,
                "-description": "",
                "-cmd": false,
                "-archive": false,
                "-group": "Без группы",
                "-measurement": null,
                "-coefficient": "",
                "-luaExpression": "test3 = cos(self())",
                "-specialCycleDelay": ""
            },
            {
                "-id": "3",
                "-isSpecial": false,
                "-name": "test3",
                "-type": "4 байта – с плавающей точкой",
                "-isLua": false,
                "-description": "",
                "-cmd": false,
                "-archive": true,
                "-group": "Без группы",
                "-measurement": null,
                "-coefficient": 1,
                "-luaExpression": "",
                "-specialCycleDelay": ""
            }
        ]
    },
    "send": {
        "connection": [
            {
                "protocol": {
                    "-indexName": "SENDtestName2GPIO",
                    "-name": "GPIO",
                    "-isLog": true,
                    "-contactBounce": "200"
                },
                "dataObjects": [
                    {   
                        "dataObject": [
                            {
                                "-id": "1",
                                "-address": "1",
                                "-function": "OUT",
                                "-variable": "test1",
                                "-description": ""
                            }
                        ]
                    }
                ]
            },
            {
                "protocol": {
                    "-indexName": "SENDmodbus123",
                    "-name": "Modbus",
                    "-isLog": false,
                    "-deviceAddress": "1",
                    "-port": "ttyS0",
                    "-baudRate": "57600",
                    "-stopBit": "1",
                    "-parity": "None",
                    "-order2": "LittleEndian",
                    "-order4": "1-0 3-2",
                    "-pollPeriod": "21"
                },
                "dataObjects": [
                    {
                        "dataObject": [
                            {
                                "-id": "1",
                                "-address": "2",
                                "-function": "1",
                                "-variable": "test2",
                                "-type": "1 бит – bool",
                                "-description": ""
                            }
                        ]
                    }
                ]
            },
            {
                "protocol": {
                    "-indexName": "SENDiec12",
                    "-name": "IEC 60870-5-104",
                    "-isLog": false,
                    "-isClient": false,
                    "-ipaddress": "0.0.0.0",
                    "-port": "12",
                    "-lengthOfASDU": "1",
                    "-lengthOfCause": "1",
                    "-lengthOfAdr": "1",
                    "-k": "1",
                    "-w": "1",
                    "-t0": "1",
                    "-t1": "1",
                    "-t2": "1",
                    "-t3": "1"
                },
                "dataObjects": [
                    {
                        "ASDU": [
                            {
                                "-id": "1",
                                "-asdu": "1",
                                "-isSporadically": false,
                                "-pollMode": "noPoll",
                                "-pollPeriod": "",
                                "dataObject": [
                                    {
                                        "-id": "1",
                                        "-address": "12",
                                        "-variable": "test3",
                                        "-type": "Однопозиционный ТС",
                                        "-aperture": null,
                                        "-exec": "",
                                        "-description": ""
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    "receive": {
        "connection": [
            {
                "protocol": {
                    "-indexName": "testName2GPIO",
                    "-name": "GPIO",
                    "-isLog": true,
                    "-contactBounce": "200"
                },
                "dataObjects": [
                    {   
                        "dataObject": [
                            {
                                "-id": "1",
                                "-address": "1",
                                "-function": "OUT",
                                "-variable": "test1",
                                "-description": ""
                            }
                        ]
                    }
                ]
            },
            {
                "protocol": {
                    "-indexName": "modbus123",
                    "-name": "Modbus",
                    "-isLog": false,
                    "-deviceAddress": "1",
                    "-port": "ttyS0",
                    "-baudRate": "57600",
                    "-stopBit": "1",
                    "-parity": "None",
                    "-order2": "LittleEndian",
                    "-order4": "1-0 3-2",
                    "-pollPeriod": "21"
                },
                "dataObjects": [
                    {
                        "dataObject": [
                            {
                                "-id": "1",
                                "-address": "2",
                                "-function": "1",
                                "-variable": "test2",
                                "-type": "1 бит – bool",
                                "-description": ""
                            }
                        ]
                    }
                ]
            },
            {
                "protocol": {
                    "-indexName": "iec12",
                    "-name": "IEC 60870-5-104",
                    "-isLog": false,
                    "-isClient": false,
                    "-ipaddress": "0.0.0.0",
                    "-port": "12",
                    "-lengthOfASDU": "1",
                    "-lengthOfCause": "1",
                    "-lengthOfAdr": "1",
                    "-k": "1",
                    "-w": "1",
                    "-t0": "1",
                    "-t1": "1",
                    "-t2": "1",
                    "-t3": "1"
                },
                "dataObjects": [
                    {
                        "ASDU": [
                            {
                                "-id": "1",
                                "-asdu": "1",
                                "-isSporadically": false,
                                "-pollMode": "noPoll",
                                "-pollPeriod": "",
                                "dataObject": [
                                    {
                                        "-id": "1",
                                        "-address": "12",
                                        "-variable": "test3",
                                        "-type": "Однопозиционный ТС",
                                        "-aperture": null,
                                        "-exec": "",
                                        "-description": ""
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

// Вариант №1
export const receive = [
    {
        id: "r1.1",
        type: "interface",
        subType: "rs485",
        parent: "r1",
        ignoreChildren: false,
        setting: {},
        children: [
            {
                id: "r1.1.1",
                type: "protocol",
                subType: "modbus-rtu",
                parent: "r1.1",
                ignoreChildren: false,
                setting: {
                    name: "modbus123",
                    logging: false,
                    deviceAddress: "1",
                    port: "ttyS0",
                    baudRate: "57600",
                    stopBit: "1",
                    parity: "None",
                    order2: "LittleEndian",
                    order4: "1-0 3-2",
                    pollPeriod: "21"
                },
                children: [
                    {
                        id: "r1.1.1.1",
                        type: "functionGroup",
                        subType: "16", // функции из протокола modbus, по которым можно сгруппировать сигналы для опроса
                        parent: "r1.1.1",
                        ignoreChildren: false,
                        setting: {
                            // подумать, что тут может быть
                        },
                        children: [
                            {
                                id: "r1.1.1.1.1",
                                type: "dataObject",
                                subType: null, // что, если присваивать тип родителя или тип протокола/интерфейса?
                                parent: "r1.1.1.1",
                                setting: {
                                    address: "2",
                                    function: "1",
                                    variable: "test2",
                                    type: "1 бит – bool",
                                    description: ""
                                }
                            }
                        ]
                    },
                ],
            }
        ]
    },
    {
        id: "r1.2",
        type: "protocol",
        subType: "iec104",
        parent: "r1",
        ignoreChildren: false,
        setting: {
            name: "testName2IEC104",
            logging: false,
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
            t3: "1"
        },
        children: [
            {
                id: "r1.2.1",
                type: "asdu",
                subType: null, // что, если присваивать тип родителя или тип протокола/интерфейса?
                parent: "r1.2",
                ignoreChildren: false,
                setting: {
                    address: "1",
                    sporadical: false,
                    pollMode: "noPoll",
                    pollPeriod: "",
                },
                children: [
                    {
                        id: "r1.2.1.1",
                        type: "dataObject",
                        subType: null, // что, если присваивать тип родителя или тип протокола/интерфейса?
                        parent: "r1.2.1",
                        setting: {
                            address: "12",
                            variable: "test3",
                            type: "Однопозиционный ТС",
                            aperture: null,
                            exec: "",
                            description: ""
                        },
                    }
                ]
            }
        ]
    },
    {
        id: "r1.3",
        type: "protocol",
        subType: "gpio",
        parent: "r1",
        ignoreChildren: false,
        setting: {
            name: "testName2GPIO",
            logging: false,
            contactBounce: "200"
        },
        children: [
            {
                id: "r1.3.1",
                type: "dataObject",
                subType: null, // что, если присваивать тип родителя или тип протокола/интерфейса?
                parent: "r1.3",
                setting: {
                    address: "1",
                    variable: "test1",
                    function: "OUT",
                    description: ""
                },
            }
        ]
    }
];

export const variable = [
    {
        id: "3.1",
        type: "variable",
        subType: null,
        parent: "v1",
        setting: {
            id: "1",
            isSpecial: true,
            name: "test1",
            type: "1 бит – bool",
            isLua: true,
            description: "Lorem ipsum dolor sit amet consectetur",
            cmd: true,
            archive: true,
            group: "Без группы",
            measurement: null,
            coefficient: "",
            luaExpression: "test2 = test2 + 1",
            specialCycleDelay: 5
        }
    },
    {
        id: "3.2",
        type: "folder",
        subType: null,
        parent: "v1",
        ignoreChildren: false,
        setting: {
            /* Примерное содержимое */
            name: "test2",
            description: "",
            group: "",
            alias: "",
            tags: []
        },
        children: [
            {
                id: "3.2.1",
                type: "variable",
                subType: null,
                parent: "v1.2",
                setting: {
                    isSpecial: true,
                    name: "test3",
                    type: "1 бит – bool",
                    isLua: true,
                    description: "Lorem ipsum dolor sit amet consectetur",
                    cmd: true,
                    archive: true,
                    group: "Без группы",
                    measurement: null,
                    coefficient: "",
                    luaExpression: "test2 = test2 + 1",
                    specialCycleDelay: 5
                }
            }
        ]
    },
    {
        id: "3.3",
        type: "variable",
        subType: null,
        parent: "v1",
        setting: {
            name: "test4",
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
            specialCycleDelay: 5
        }
    }
];

export const send = receive;

export const config = {
    id: "1",
    type: "configuration",
    subType: null,
    parent: null,
    ignoreChildren: false,
    setting: {
        name: "Конфигурация для РЦДУ",
        description: "Конфигурация для РЦДУ в Подзалупинске",
        date: "2022-01-01 00:00",
        version: "1.0",
        hash: "SGVsbG8gd29ybGQh"
    },
    children: [
        {
            id: "1.1",
            type: "recieve",
            subType: null,
            parent: "1",
            ignoreChildren: false,
            setting: {
                
            },
            children: receive
        },
        {
            id: "2",
            type: "send",
            subType: null,
            parent: "1",
            ignoreChildren: false,
            setting: {
                
            },
            children: send
        },
        {
            id: "3",
            type: "variables",
            subType: null,
            parent: "1",
            ignoreChildren: false,
            setting: {
                
            },
            children: variable
        }
    ]
};
