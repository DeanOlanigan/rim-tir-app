import { memo } from "react";
import { useVariablesStore } from "../../../store/variables-store";
import {
    SelectRoot,
    SelectTrigger,
    SelectValueText,
    SelectContent,
    SelectItem,
    SelectLabel,
} from "../../../components/ui/select";
import { PARAM_DEFINITIONS } from "../../../config/paramDefinitions";

export const SelectInput = memo(function SelectInput(props) {
    console.log("Render SelectInput");
    const { targetKey, id, value, showLabel = false } = props;
    const setSettings = useVariablesStore((state) => state.setSettings);
    const label = PARAM_DEFINITIONS[targetKey].label;
    const collection = PARAM_DEFINITIONS[targetKey].options;

    return (
        <SelectRoot
            maxW={"250px"}
            size={"xs"}
            collection={collection}
            value={[value]}
            onValueChange={(details) => {
                setSettings(id, {
                    [targetKey]: details.value[0],
                });
            }}
        >
            {showLabel && <SelectLabel>{label}</SelectLabel>}
            <SelectTrigger>
                <SelectValueText
                    placeholder={`Выберите ${label.toLowerCase()}`}
                />
            </SelectTrigger>
            <SelectContent>
                {collection?.items.map((row) => (
                    <SelectItem item={row} key={row.value}>
                        {row.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    );
});
