import { dataTypes, groups, baudRateList, orderTwoList, orderFourList, stopBitList, parityList, sideList } from "./filterOptions";

export const PARAM_DEFINITIONS = {
    isSpecial: {
        type: "boolean",
        label: "Специальная",
        defaultValue: false,
    },
    type: {
        type: "select",
        label: "Тип данных",
        options: dataTypes,
    },
    isLua: {
        type: "boolean",
        label: "Lua",
        defaultValue: false
    },
    description: {
        type: "textarea",
        label: "Описание",
    },
    cmd: {
        type: "boolean",
        label: "Команда пользователя",
        defaultValue: false
    },
    archive: {
        type: "boolean",
        label: "В архив",
        defaultValue: false
    },
    group: {
        type: "select",
        label: "Группа",
        options: groups
    },
    measurement: {
        type: "select",
        label: "Единицы измерения",
        options: null
    },
    coefficient: {
        type: "number",
        label: "Коэффициент"
    },
    luaExpression: "textarea",
    specialCycleDelay: "number",
    isLog: {
        type: "boolean",
        label: "Логирование",
        defaultValue: false
    },
    isClient: {
        type: "boolean",
        label: "Клиент",
        defaultValue: false
    },
    logging: {
        type: "boolean",
        label: "Логирование",
        defaultValue: false
    },
    contactBounce: {
        type: "number",
        label: "Период дребезга"
    },
    side: {
        type: "select",
        label: "Тип",
        options: sideList
    },
    address: {
        type: "input",
        label: "Адрес"
    },
    port: {
        type: "number",
        label: "Порт"
    },
    lengthOfASDU: {
        type: "number",
        label: "Длина адреса ASDU"
    },
    lengthOfCause: {
        type: "number",
        label: "Длина причины передачи"
    },
    lengthOfAdr: {
        type: "number",
        label: "Длина адреса объекта"
    },
    k: {
        type: "number",
        label: "k"
    },
    w: {
        type: "number",
        label: "w"
    },
    t0: {
        type: "number",
        label: "t0"
    },
    t1: {
        type: "number",
        label: "t1"
    },
    t2: {
        type: "number",
        label: "t2"
    },
    t3: {
        type: "number",
        label: "t3"
    },
    deviceAddress: {
        type: "number",
        label: "Адрес устройства"
    },
    baudRate: {
        type: "select",
        label: "Скорость",
        options: baudRateList
    },
    stopBit: {
        type: "select",
        label: "Стоп-бит",
        options: stopBitList
    },
    parity: {
        type: "select",
        label: "Паритет",
        options: parityList
    },
    order2: {
        type: "select",
        label: "Порядок 2-х байт",
        options: orderTwoList
    },
    order4: {
        type: "select",
        label: "Порядок 4-х байт",
        options: orderFourList
    },
    pollPeriod: {
        type: "number",
        label: "Период опроса"
    },
    variable: {
        type: "select",
        label: "Переменная"
    },
    function: {
        type: "select",
        label: "Функция"
    }
};
