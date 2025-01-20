import { Box } from "@chakra-ui/react";
import { 
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText
} from "../../../components/ui/select";
import { points } from "./graphSettingsConstants";

function PointsCountChooser({ maxPointsCount, onChange }) {
    return (
        <Box>
            <SelectRoot
                collection={points}
                size={"xs"}
                defaultValue={[String(maxPointsCount)]}
                onValueChange={(value) => {
                    onChange(parseInt(value.value[0]));
                }}
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
