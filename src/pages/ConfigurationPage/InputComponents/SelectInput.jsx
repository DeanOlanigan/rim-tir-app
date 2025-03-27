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
import { Select } from "@chakra-ui/react";
import { PARAM_DEFINITIONS } from "../../../config/paramDefinitions";

export const SelectInput = memo(function SelectInput(props) {
    //console.log("Render SelectInput");
    const { targetKey, id, value, showLabel = false, ...rest } = props;
    const setSettings = useVariablesStore((state) => state.setSettings);
    const label = PARAM_DEFINITIONS[targetKey].label;
    const collection = PARAM_DEFINITIONS[targetKey].options;

    return (
        <Select.Root
            maxW={"250px"}
            size={"xs"}
            {...rest}
            collection={collection}
            value={[value]}
            onValueChange={(details) => {
                setSettings(id, {
                    [targetKey]: details.value[0],
                });
            }}
            positioning={{ sameWidth: true, placement: "bottom" }}
        >
            {showLabel && <Select.Label>{label}</Select.Label>}
            <Select.HiddenSelect />
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText
                        placeholder={`Выберите ${label.toLowerCase()}`}
                    />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
                <Select.Content>
                    {collection?.items.map((row) => (
                        <Select.Item item={row} key={row.value}>
                            {row.label}
                            <Select.ItemIndicator />
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Positioner>
        </Select.Root>
    );
});
