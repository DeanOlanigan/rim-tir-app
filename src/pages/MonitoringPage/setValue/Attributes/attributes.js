import {
    LuAudioWaveform,
    LuCircleX,
    LuFlaskConical,
    LuLayers,
    LuMoveHorizontal,
    LuOctagonAlert,
    LuOctagonMinus,
    LuRefreshCcw,
    LuReplace,
    LuTrendingUpDown,
} from "react-icons/lu";
import { TbClockExclamation } from "react-icons/tb";
import { PiNetworkXFill } from "react-icons/pi";

export const attributes = {
    test: {
        name: "test",
        label: "Тестовый",
        description:
            "Помечает значение как тестовое. Используется в режимах проверки и не должно восприниматься как рабочее измерение или команда.",
        icon: { as: LuFlaskConical, color: "fg.info" },
    },
    inaccurate: {
        name: "inaccurate",
        label: "Неточный",
        description:
            "Отмечает значение как недостаточно точное относительно заявленной точности источника.",
        icon: { as: LuTrendingUpDown, color: "fg.error" },
    },
    inconsistent: {
        name: "inconsistent",
        label: "Несогласованный",
        description: "Функция оценки обнаружила несогласованность данных.",
        icon: { as: PiNetworkXFill, color: "fg.error" },
    },
    failure: {
        name: "failure",
        label: "Аварийный",
        description:
            "Указывает, что значение получено в результате отказа или неисправности.",
        icon: { as: LuOctagonAlert, color: "fg.error" },
    },
    oscillatory: {
        name: "oscillatory",
        label: "Колебательный",
        description:
            "Указывает, что бинарный сигнал быстро колеблется и распознан как осциллирующий.",
        icon: { as: LuAudioWaveform, color: "fg.warning" },
    },
    badReference: {
        name: "badReference",
        label: "Неверная опорная величина",
        description:
            "Значение может быть некорректным из-за некорректной опорной величины.",
        icon: { as: LuRefreshCcw, color: "fg.warning" },
    },
    outOfRange: {
        name: "outOfRange",
        label: "Выход за пределы",
        description:
            "Указывает, что значение вышло за заранее определённый допустимый диапазон.",
        icon: { as: LuMoveHorizontal, color: "fg.warning" },
    },
    blocked: {
        name: "blocked",
        label: "Заблокирован",
        description:
            "Указывает, что дальнейшее обновление значения остановлено оператором.",
        icon: { as: LuOctagonMinus, color: "fg.error" },
    },
    overflowed: {
        name: "overflowed",
        label: "Переполнен",
        description:
            "Указывает, что значение превысило максимально допустимое значение для данного типа данных.",
        icon: { as: LuLayers, color: "fg.error" },
    },
    invalid: {
        name: "invalid",
        label: "Недостоверный",
        description:
            "Указывает, что значение считается недействительным и не должно использоваться как достоверное.",
        icon: { as: LuCircleX, color: "fg.error" },
    },
    outdated: {
        name: "outdated",
        label: "Устаревший",
        description:
            "Помечает значение как неактуальное: последнее обновление не удалось или данные устарели.",
        icon: { as: TbClockExclamation, color: "fg.warning" },
    },
    substituted: {
        name: "substituted",
        label: "Замещен",
        description:
            "Указывает, что значение было заменено оператором или автоматикой.",
        icon: { as: LuReplace, color: "fg.warning" },
    },
};

export const attributesGrouped = [
    {
        name: "61850-7-3",
        label: "Атрибуты качества IEC 61850-7-3",
        attributes: [
            "test",
            "inaccurate",
            "inconsistent",
            "failure",
            "oscillatory",
            "badReference",
            "outOfRange",
            "blocked",
            "overflowed",
            "outdated",
            "substituted",
        ],
    },
    {
        name: "iec101",
        label: "Атрибуты качества IEC 60870-5-101/104",
        attributes: [
            "invalid",
            "outOfRange",
            "blocked",
            "outdated",
            "substituted",
        ],
    },
];
