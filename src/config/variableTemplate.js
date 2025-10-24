export const variable = {
    node: "variable",
    type: "variable",
    label: "Переменная",
    icon: "variable",
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
            ],
            default: "bit",
        },
        description: {
            type: "string",
            label: "Описание",
            default: "",
        },
        isSpecial: {
            type: "boolean",
            label: "Цикличная",
            shortname: "Ц",
            icon: "refresh",
            color: "purple",
            showInTree: true,
            default: false,
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
                    "bit",
                ],
            },
        },
        specialCycleDelay: {
            type: "number",
            label: "Задержка цикла, сек",
            default: 2,
            visibleIf: {
                and: [
                    {
                        "==": [
                            {
                                find: [
                                    {
                                        what: "isSpecial",
                                        where: "self",
                                    },
                                ],
                            },
                            true,
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
                            "bit",
                        ],
                    },
                ],
            },
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
        graph: {
            type: "boolean",
            label: "В архив ТИ",
            shortname: "ТИ",
            icon: "chart",
            color: "red",
            showInTree: true,
            default: false,
            visibleIf: {
                "!": [
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
                ],
            },
        },
        measurement: {
            type: "enum",
            label: "Единица измерения",
            enumValues: [
                { label: "В", value: "V" },
                { label: "кВ", value: "kV" },
                { label: "мВ", value: "mV" },
                { label: "А", value: "A" },
                { label: "кА", value: "kA" },
                { label: "мА", value: "mA" },
            ],
            default: "V",
        },
        aperture: {
            type: "number",
            label: "Апертура",
            default: 0,
        },
        cmd: {
            type: "boolean",
            label: "ТУ",
            shortname: "ТУ",
            icon: "terminal",
            color: "blue",
            showInTree: true,
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
                ],
            },
        },
        archive: {
            type: "boolean",
            label: "В архив ТС",
            shortname: "ТС",
            icon: "archive",
            color: "teal",
            showInTree: true,
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
                ],
            },
        },
        group: {
            type: "enum",
            label: "Группа",
            enumValues: [
                {
                    label: "Предупредительные",
                    value: "warn",
                    color: "orange",
                    icon: "error",
                },
                {
                    label: "Аварийные",
                    value: "danger",
                    color: "red",
                    icon: "error",
                },
                {
                    label: "Оперативного состояния",
                    value: "state",
                    color: "teal",
                    icon: "info",
                },
                {
                    label: "Без группы",
                    value: "noGroup",
                    color: "green",
                    icon: null,
                },
            ],
            default: "noGroup",
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
                ],
            },
        },
        luaExpression: {
            type: "code",
            label: "Lua выражение",
            default: "",
        },
    },
};
