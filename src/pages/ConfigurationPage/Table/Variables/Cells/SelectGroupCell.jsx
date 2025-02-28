import {
    SelectContent,
    SelectItem,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "../../../../../components/ui/select";
import { groups } from "../../../../../config/filterOptions";
import { useVariablesStore } from "../../../../../store/variables-store";
import { memo } from "react";

export const SelectGroupCell = memo(function SelectGroupCell({ group, id }) {
    console.log("Render SelectGroupCell");
    const setSettings = useVariablesStore((state) => state.setSettings);

    return (
        <SelectRoot
            size={"xs"}
            collection={groups}
            value={[group]}
            onValueChange={(details) => {
                setSettings(id, {
                    group: details.value[0],
                });
            }}
        >
            <SelectTrigger>
                <SelectValueText placeholder="Выберите группу" />
            </SelectTrigger>
            <SelectContent>
                {groups.items.map((row) => (
                    <SelectItem item={row} key={row.value}>
                        {row.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    );
});
