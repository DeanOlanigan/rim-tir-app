import { createListCollection } from "@chakra-ui/react";

export const testVariables = createListCollection({
    items: [
        { label: "test2", value: "test2" },
        { label: "test1", value: "test1" },
        { label: "test3", value: "test3" },
        { label: "var4", value: "var4" },
        { label: "var5", value: "var5" },
        { label: "var6", value: "var6" },
    ],
});
export const points = createListCollection({
    items: [
        { label: "10", value: "10" },
        { label: "20", value: "20" },
        { label: "50", value: "50" },
        { label: "100", value: "100" },
        { label: "200", value: "200" },
        { label: "500", value: "500" },
        { label: "1000", value: "1000" },
    ],
});
export const offsets = createListCollection({
    items: [
        { label: "10 секунд", value: "10",  },
        { label: "20 секунд", value: "20",  },
        { label: "30 секунд", value: "30",  },
        { label: "1 минута", value: "60",  },
        { label: "2 минуты", value: "120",  },
        { label: "3 минуты", value: "180",  },
        { label: "4 минуты", value: "240",  },
        { label: "5 минут", value: "300",  },
        { label: "10 минут", value: "600",  },
        { label: "15 минут", value: "900",  },
        { label: "20 минут", value: "1200",  },
        { label: "30 минут", value: "1800",  },
        { label: "1 час", value: "3600",  },
        { label: "2 часа", value: "7200",  },
        { label: "4 часа", value: "14400",  },
        { label: "6 часов", value: "21600",  },
        { label: "12 часов", value: "43200",  },
        { label: "24 часа", value: "86400",  },
    ],
});
export const swatches = [
    "#000000",
    "#4A5568",
    "#F56565",
    "#ED64A6",
    "#9F7AEA",
    "#6B46C1",
    "#4299E1",
    "#0BC5EA",
    "#00B5D8",
    "#38B2AC",
    "#48BB78",
    "#68D391",
    "#ECC94B",
    "#DD6B20",
    "#FF638480",
    "#FF6384"
];
export const measurements = createListCollection({
    items: [
        { label: "°С", value: "°С" },
        { label: "Па", value: "Па" },
        { label: "кПа", value: "кПа" },
        { label: "Вт", value: "Вт" },
        { label: "кВт", value: "кВт" },
        { label: "мВт", value: "мВт" },
        { label: "В", value: "В" },
        { label: "кВ", value: "кВ" },
        { label: "А", value: "А" },
        { label: "кА", value: "кА" },
    ]
});
