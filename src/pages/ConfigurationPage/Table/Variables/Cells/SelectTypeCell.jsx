import {
    SelectContent,
    SelectItem,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "../../../../../components/ui/select";
import { dataTypes } from "../../../../../config/filterOptions";
import { useVariablesStore } from "../../../../../store/variables-store";
import { memo } from "react";

export const SelectTypeCell = memo(function SelectTypeCell({ type, id }) {
    console.log("Render SelectTypeCell");
    const setSettings = useVariablesStore((state) => state.setSettings);

    return (
        <SelectRoot
            size={"xs"}
            collection={dataTypes}
            value={[type]}
            onValueChange={(details) => {
                setSettings(id, {
                    type: details.value[0],
                });
            }}
        >
            <SelectTrigger>
                <SelectValueText placeholder="Выберите тип" />
            </SelectTrigger>
            <SelectContent>
                {dataTypes.items.map((row) => (
                    <SelectItem item={row} key={row.value}>
                        {row.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    );
});
