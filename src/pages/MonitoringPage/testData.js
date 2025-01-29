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
        type: "interface",
        name: "RS485",
        setting: {},
        children: [
            {
                type: "protocol",
                name: "GPIO",
                setting: {},
                children: [
                    {
                        type: "connection",
                        name: "testName2GPIO",
                        setting: {},
                        children: [
                            {
                                type: "dataObject",
                                name: "test1",
                                setting: {},
                                children: []
                            },
                            {
                                type: "folder",
                                name: "test2",
                                setting: {},
                                children: [
                                    {
                                        type: "dataObject",
                                        name: "test3",
                                        setting: {},
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ],
            },
            {
                type: "protocol",
                name: "Modbus",
                setting: {},
                children: [
                    {
                        type: "connection",
                        name: "testName2GPIO",
                        setting: {},
                        children: [
                            {
                                type: "dataObject",
                                name: "test1",
                                setting: {},
                                children: []
                            },
                            {
                                type: "folder",
                                name: "test2",
                                setting: {},
                                children: [
                                    {
                                        type: "dataObject",
                                        name: "test3",
                                        setting: {},
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ],
            },
            {
                type: "protocol",
                name: "IEC104",
                setting: {},
                children: [
                    {
                        type: "connection",
                        name: "testName2IEC104",
                        setting: {},
                        children: [
                            {
                                type: "ASDU",
                                name: "test1",
                                setting: {},
                                children: [
                                    {
                                        type: "dataObject",
                                        name: "test3",
                                        setting: {},
                                        children: []
                                    }
                                ]
                            },
                            {
                                type: "folder",
                                name: "test2",
                                setting: {},
                                children: [
                                    {
                                        type: "ASDU",
                                        name: "test3",
                                        setting: {},
                                        children: [
                                            {
                                                type: "dataObject",
                                                name: "test4",
                                                setting: {},
                                                children: []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
            }
        ]
    }
];

export const variable = [
    {
        type: "variable",
        name: "test1",
        setting: {
            id: "1",
            isSpecial: true,
            type: "1 бит – bool",
            isLua: true,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sit iure ea, odit nemo nobis non qua Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sit iure ea, odit nemo nobis non qua Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sit iure ea, odit nemo nobis non qua",
            cmd: true,
            archive: true,
            group: "Без группы",
            measurement: null,
            coefficient: "",
            luaExpression: "test2 = test2 + 1",
            specialCycleDelay: 5
        },
        children: []
    },
    {
        type: "folder",
        name: "test2",
        setting: {
            id: "1",
            isSpecial: true,
            type: "1 бит – bool",
            isLua: true,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sit iure ea, odit nemo nobis non qua Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sit iure ea, odit nemo nobis non qua Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sit iure ea, odit nemo nobis non qua",
            cmd: true,
            archive: true,
            group: "Без группы",
            measurement: null,
            coefficient: "",
            luaExpression: "test2 = test2 + 1",
            specialCycleDelay: 5
        },
        children: [
            {
                type: "variable",
                name: "test3",
                setting: {
                    id: "1",
                    isSpecial: true,
                    type: "1 бит – bool",
                    isLua: true,
                    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sit iure ea, odit nemo nobis non qua Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sit iure ea, odit nemo nobis non qua Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sit iure ea, odit nemo nobis non qua",
                    cmd: true,
                    archive: true,
                    group: "Без группы",
                    measurement: null,
                    coefficient: "",
                    luaExpression: "test2 = test2 + 1",
                    specialCycleDelay: 5
                },
                children: []
            }
        ]
    },
    {
        type: "variable",
        name: "test4",
        setting: {
            id: "1",
            isSpecial: true,
            type: "1 бит – bool",
            isLua: true,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sit iure ea, odit nemo nobis non qua Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sit iure ea, odit nemo nobis non qua Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sit iure ea, odit nemo nobis non qua",
            cmd: true,
            archive: true,
            group: "Без группы",
            measurement: null,
            coefficient: "",
            luaExpression: "test2 = test2 + 1",
            specialCycleDelay: 5
        },
        children: []
    }
];

export const send = receive;

export const config = {
    type: "root",
    name: "root",
    setting: {},
    children: [
        {
            type: "recieve",
            name: "recieve",
            setting: {},
            children: receive
        },
        {
            type: "send",
            name: "send",
            setting: {},
            children: send
        },
        {
            type: "variable",
            name: "variable",
            setting: {},
            children: variable
        }
    ]
};
