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
//import { useGraphContext } from "../../../providers/GraphProvider/GraphContext";

import { useAtom } from "jotai";
import { maxPointsCountAtom } from "../atoms";

function PointsCountChooser() {
    console.log("Render PointsCountChooser");
    //const { maxPointsCount, setMaxPointsCount } = useGraphContext();
    const [maxPointsCount, setMaxPointsCount] = useAtom(maxPointsCountAtom);

    return (
        <Box>
            <SelectRoot
                collection={points}
                size={"xs"}
                value={[maxPointsCount.toString()]}
                onValueChange={(e) => {
                    setMaxPointsCount(parseInt(e.value[0]));
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
