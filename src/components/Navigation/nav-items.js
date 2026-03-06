import {
    LuActivity,
    LuChartLine,
    LuCog,
    LuNotebook,
    LuScrollText,
    LuSquareMousePointer,
} from "react-icons/lu";

export const navItems = [
    {
        name: "Конфигурация",
        path: "configuration",
        icon: LuCog,
        right: "config.view",
    },
    {
        name: "Мониторинг",
        path: "monitoring",
        icon: LuActivity,
        right: "monitoring.view",
    },
    {
        name: "Логирование",
        path: "log",
        icon: LuScrollText,
        right: "logs.view",
    },
    {
        name: "Журналирование",
        path: "journal",
        icon: LuNotebook,
        right: "journal.view",
    },
    {
        name: "Графики",
        path: "graph",
        icon: LuChartLine,
        right: "graphs.view",
    },
    {
        name: "Редактор HMI",
        path: "HMIEditor",
        icon: LuSquareMousePointer,
        right: "hmi.view",
    },
];
