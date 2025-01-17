import { createListCollection } from "@chakra-ui/react";
import { 
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText
} from "../../../../components/ui/select";

const offsets = createListCollection({
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

function OffsetPicker() {
    return (
        <SelectRoot
            collection={offsets}
            size={"xs"}
            defaultValue={["120"]}
        >
            <SelectLabel>Оффсет:</SelectLabel>
            <SelectTrigger>
                <SelectValueText placeholder="Выберите оффсет" />
            </SelectTrigger>
            <SelectContent>
                {offsets.items.map((row) => (
                    <SelectItem item={row} key={row.value}>
                        {row.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    );
}

export default OffsetPicker;