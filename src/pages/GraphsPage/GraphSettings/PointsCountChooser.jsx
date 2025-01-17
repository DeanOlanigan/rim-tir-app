import { Box, createListCollection } from "@chakra-ui/react";
import { 
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText
} from "../../../components/ui/select";

const points = createListCollection({
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

function PointsCountChooser() {
    return (
        <Box>
            <SelectRoot
                collection={points}
                size={"xs"}
                defaultValue={["100"]}
            >
                <SelectLabel>Количество точек:</SelectLabel>
                <SelectTrigger>
                    <SelectValueText placeholder="Выберите количество точек" />
                </SelectTrigger>
                <SelectContent>
                    {points.items.map((row) => (
                        <SelectItem item={row} key={row.value}>
                            {row.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </SelectRoot>
        </Box>
    );
}

export default PointsCountChooser;
