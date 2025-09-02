import {
    LuCircleX,
    LuHardDriveUpload,
    LuMonitorCheck,
    LuOctagonMinus,
    LuSquareFunction,
} from "react-icons/lu";
import {
    TbClockExclamation,
    TbExclamationMark,
    TbHandStop,
    TbHelpHexagonFilled,
} from "react-icons/tb";

export const attributes = [
    {
        name: "used",
        short: "US",
        label: "Используется",
        description: "Значение привязано к источнику",
        icon: { as: LuMonitorCheck, color: "green" },
    },
    {
        name: "additionalCalc",
        short: "AC",
        label: "Доп. расчет",
        description: "Значение дорасчитывается",
        icon: { as: LuSquareFunction },
    },
    {
        name: "blocked",
        short: "BL",
        label: "Заблокирован",
        description:
            "Значение сигнала заблокировано - обновление и дорасчет не будут выполняться при поступлении данных",
        icon: { as: LuOctagonMinus, fill: "red", color: "bg" },
    },
    {
        name: "overflow",
        short: "OV",
        label: "Переполнен",
        description: "Описатель качества 101 протокола - OV",
        icon: { as: LuHardDriveUpload },
    },
    {
        name: "unknown",
        short: "UN",
        label: "Неизвестный",
        description:
            "Неопределенное состояние двухпозиционного сигнала:\n- контакты НР и НЗ замкнуты (значение сигнала равно 1);\n- контакты НР и НЗ разомкнуты (значение сигнала равно 0)",
        icon: { as: TbHelpHexagonFilled, color: "teal" },
    },
    {
        name: "manual",
        short: "BL",
        label: "Ручной",
        description:
            "Описатель качества 101 протокола - BL:\nуправление объектом информации передано пользователю, из-за чего передача реального значения не выполняется (ручное управление параметром средствами ОИК энергообъекта или АРМ ТМ)",
        icon: { as: TbHandStop, color: "fg.info" },
    },
    {
        name: "substituted",
        short: "SB",
        label: "Замещен",
        description:
            "Описатель качества 101 протокола - SB:\nвыполнено замещение значения резервным значением автоматически из альтернативной системы сбора\nили значение установлено пользователем вручную (ручной BL)",
        icon: { as: TbExclamationMark, color: "fg.error" },
    },
    {
        name: "notTopical",
        short: "NT",
        label: "Устаревший",
        description:
            "Описатель качества 101 протокола - NT:\nзначение не обновлялось в течение контрольного промежутка времени\n- соответствует переходному состоянию информационного объекта\nот действительного к недействительному состоянию, когда значение объекта устарело,\nно еще не выявлено явной неисправности в системе ТМ",
        icon: { as: TbClockExclamation, color: "fg.error" },
    },
    {
        name: "invalid",
        short: "IV",
        label: "Недостоверный",
        description:
            "Описатель качества 101 протокола - IV:\nпервичный сбор информации не выполнялся",
        icon: { as: LuCircleX, fill: "fg.warning", color: "bg" },
    },
];
