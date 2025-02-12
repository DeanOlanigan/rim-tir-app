import { createListCollection } from "@chakra-ui/react";

export const dataTypes = createListCollection({
    items: [
        { label: "1 бит - bool", value: "bit",  },
        { label: "2 байта - целое без знака", value: "2byte_unsigned",  },
        { label: "2 байта - целое", value: "2byte_signed",  },
        { label: "4 байта - целое", value: "4byte_signed",  },
        { label: "4 байта - целое без знака", value: "4byte_unsigned",  },
        { label: "4 байта - с плавающей точкой", value: "4byte_float",  },
    ],
});

export const groups = createListCollection({
    items: [
        { label: "Предупредительные", value: "warn",  },
        { label: "Аварийные", value: "danger",  },
        { label: "Оперативного состояния", value: "state",  },
        { label: "Без группы", value: "no_group",  },
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
        { label: "read exception status", value: 7 },
        { label: "diagnostic", value: 8 },
        { label: "get Com event counter", value: 11 },
        { label: "get Com event log", value: 12 },
        { label: "write multiple coils", value: 15 },
        { label: "write multiple holding registers", value: 16 },
        { label: "report slave ID", value: 17 },
        { label: "read file record", value: 20 },
        { label: "write file record", value: 21 },
        { label: "mask write register", value: 22 },
        { label: "read/write register", value: 23 },
        { label: "read fifo queue", value: 24 },
        { label: "read device identification", value: 43 },
    ]
});
