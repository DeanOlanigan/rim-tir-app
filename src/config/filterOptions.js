import { createListCollection } from "@chakra-ui/react";

export const dataTypesBytes = createListCollection({
    items: [
        { label: "1 бит - bool", value: "bit" },
        { label: "2 байта - целое без знака", value: "twoByteUnsigned" },
        { label: "2 байта - целое", value: "twoByteSigned" },
        { label: "4 байта - целое", value: "fourByteSigned" },
        { label: "4 байта - целое без знака", value: "fourByteUnsigned" },
        { label: "4 байта - с плавающей точкой", value: "fourByteFloat" },
    ],
});

export const groups = createListCollection({
    items: [
        { label: "Предупредительные", value: "warn" },
        { label: "Аварийные", value: "danger" },
        { label: "Оперативного состояния", value: "state" },
        { label: "Без группы", value: "noGroup" },
    ],
});

export const modbusFunctionGroupTypes = createListCollection({
    items: [
        { label: "read coils", value: 1 },
        { label: "read discrete inputs", value: 2 },
        { label: "read multiple holding registers", value: 3 },
        { label: "read input registers", value: 4 },
        { label: "write single coil", value: 5 },
        { label: "write single holding register", value: 6 },
        /* { label: "read exception status", value: 7 },
        { label: "diagnostic", value: 8 },
        { label: "get Com event counter", value: 11 },
        { label: "get Com event log", value: 12 },
        { label: "write multiple coils", value: 15 }, */
        { label: "write multiple holding registers", value: 16 },
        /* { label: "report slave ID", value: 17 },
        { label: "read file record", value: 20 },
        { label: "write file record", value: 21 },
        { label: "mask write register", value: 22 },
        { label: "read/write register", value: 23 },
        { label: "read fifo queue", value: 24 },
        { label: "read device identification", value: 43 }, */
    ],
});

export const orderFourList = createListCollection({
    items: [
        { label: "1-0 3-2 стандарт", value: "1-0 3-2" },
        { label: "0-1 2-3", value: "0-1 2-3" },
        { label: "3-2 1-0", value: "3-2 1-0" },
        { label: "2-3 0-1", value: "2-3 0-1" },
    ],
});

export const orderTwoList = createListCollection({
    items: [
        { label: "1-0 старшим вперед", value: "BigEndian" },
        { label: "0-1 младшим вперед", value: "LittleEndian" },
    ],
});

export const baudRateList = createListCollection({
    items: [
        { label: "19200", value: 19200 },
        { label: "38400", value: 38400 },
        { label: "57600", value: 57600 },
        { label: "115200", value: 115200 },
        { label: "230400", value: 230400 },
    ],
});

export const parityList = createListCollection({
    items: [
        { label: "Нет", value: "none" },
        { label: "Бит нечетности", value: "oddBit" },
        { label: "Бит четности", value: "parityBit" },
    ],
});

export const stopBitList = createListCollection({
    items: [
        { label: "1", value: 1 },
        { label: "2", value: 2 },
    ],
});

export const sideList = createListCollection({
    items: [
        { label: "Клиент", value: "client" },
        { label: "Сервер", value: "server" },
    ],
});

export const pollModeList = createListCollection({
    items: [
        { label: "Ручной", value: "manual" },
        { label: "На старте", value: "onStart" },
        { label: "Всегда", value: "always" },
        { label: "Без опроса", value: "noPoll" },
    ],
});

export const execList = createListCollection({
    items: [
        { label: "Прямое", value: "direct" },
        { label: "Выбор/исполнить", value: "select" },
    ],
});

export const dataTypesSig = createListCollection({
    items: [
        { label: "Однопозиционный ТС", value: "ts_one_position" },
        { label: "Двухпозиционный ТС", value: "ts_two_position" },
        { label: "ТИ масштабированное", value: "ti_scaled" },
        { label: "ТИ нормализованное", value: "ti_normalized" },
        { label: "ТИ с плавающей точкой ", value: "ti_float" },
        { label: "Однопозиционное ТУ", value: "tu_one_position" },
        { label: "Двухпозиционное ТУ", value: "tu_two_position" },
    ],
});

export const gpioFuncType = createListCollection({
    items: [
        { label: "Вход", value: "input" },
        { label: "Выход", value: "output" },
    ],
});

export const measurements = createListCollection({
    items: [
        { label: "В", value: "V" },
        { label: "кВ", value: "kV" },
        { label: "мВ", value: "mV" },
        { label: "А", value: "A" },
        { label: "кА", value: "kA" },
        { label: "мА", value: "mA" },
    ],
});

export const lengthOfASDUList = createListCollection({
    items: [
        { label: "1 байт", value: 1 },
        { label: "2 байта", value: 2 },
    ],
});

export const lengthOfCauseList = createListCollection({
    items: [
        { label: "1 байт", value: 1 },
        { label: "2 байта", value: 2 },
    ],
});

export const lengthOfAdrList = createListCollection({
    items: [
        { label: "1 байт", value: 1 },
        { label: "2 байта", value: 2 },
        { label: "3 байта", value: 3 },
    ],
});

export const gpioPortList = createListCollection({
    items: [
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
        { label: "5", value: 5 },
        { label: "6", value: 6 },
        { label: "7", value: 7 },
    ],
});
