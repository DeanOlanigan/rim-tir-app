import { 
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText
} from "../../../../components/ui/select";
import { offsets } from "../graphSettingsConstants";

import { useGraphContext } from "../../../../providers/GraphProvider/GraphContext";

function OffsetPicker() {
    console.log("Render OffsetPicker");
    const { setOffset } = useGraphContext();

    return (
        <SelectRoot
            collection={offsets}
            size={"xs"}
            defaultValue={["120"]}
            onValueChange={(e) => {
                setOffset(parseInt(e.value[0]));
            }}
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
