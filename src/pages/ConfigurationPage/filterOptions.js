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
