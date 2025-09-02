import { createListCollection } from "@chakra-ui/react";
import {
    LuArchive,
    LuChartSpline,
    LuInfo,
    LuRefreshCcwDot,
    LuSquareTerminal,
    LuTriangleAlert,
} from "react-icons/lu";

export const variable = {
    node: "variable",
    type: "variable",
    label: "Переменная",
    settings: {
        type: {
            type: "enum",
            label: "Тип данных",
            enumValues: createListCollection({
                items: [
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
                        value: "twoByteUnsigned",
                        min: 0,
                        max: 65535,
                        step: 1,
                        integer: true,
                    },
                    {
                        label: "2 байта - целое",
                        value: "twoByteSigned",
                        min: -32768,
                        max: 32767,
                        step: 1,
                        integer: true,
                    },
                    {
                        label: "4 байта - целое",
                        value: "fourByteSigned",
                        min: -2147483648,
                        max: 2147483647,
                        step: 1,
                        integer: true,
                    },
                    {
                        label: "4 байта - целое без знака",
                        value: "fourByteUnsigned",
                        min: 0,
                        max: 4294967295,
                        step: 1,
                        integer: true,
                    },
                    {
                        label: "4 байта - с плавающей точкой",
                        value: "fourByteFloat",
                        min: -3.402823466e38,
                        max: 3.402823466e38,
                        step: 0.1,
                        integer: false,
                        precision: 6,
                    },
                ],
            }),
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
            icon: LuRefreshCcwDot,
            color: "purple",
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
            icon: LuChartSpline,
            color: "red",
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
            enumValues: createListCollection({
                items: [
                    { label: "В", value: "V" },
                    { label: "кВ", value: "kV" },
                    { label: "мВ", value: "mV" },
                    { label: "А", value: "A" },
                    { label: "кА", value: "kA" },
                    { label: "мА", value: "mA" },
                ],
            }),
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
            icon: LuSquareTerminal,
            color: "blue",
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
                            "twoByteUnsigned",
                        ],
                    },
                ],
            },
        },
        archive: {
            type: "boolean",
            label: "В архив ТС",
            shortname: "ТС",
            icon: LuArchive,
            color: "teal",
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
                            "twoByteUnsigned",
                        ],
                    },
                ],
            },
        },
        group: {
            type: "enum",
            label: "Группа",
            enumValues: createListCollection({
                items: [
                    {
                        label: "Предупредительные",
                        value: "warn",
                        color: "orange",
                        icon: LuTriangleAlert,
                    },
                    {
                        label: "Аварийные",
                        value: "danger",
                        color: "red",
                        icon: LuTriangleAlert,
                    },
                    {
                        label: "Оперативного состояния",
                        value: "state",
                        color: "teal",
                        icon: LuInfo,
                    },
                    {
                        label: "Без группы",
                        value: "noGroup",
                        color: "green",
                        icon: null,
                    },
                ],
            }),
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
                            "twoByteUnsigned",
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
