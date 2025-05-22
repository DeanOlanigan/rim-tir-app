import { memo } from "react";
import { useVariablesStore } from "@/store/variables-store";
import { Portal, Select } from "@chakra-ui/react";
import { PARAM_DEFINITIONS } from "@/config/paramDefinitions";

export const SelectInput = memo(function SelectInput(props) {
    //console.log("Render SelectInput");
    const { id, targetKey, value, noPortal, ...rest } = props;
    const setSettings = useVariablesStore((state) => state.setSettings);
    const collection = PARAM_DEFINITIONS[targetKey].options;

    const content = (
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
    );

    return (
        <Select.Root
            lazyMount
            unmountOnExit
            size={"xs"}
            positioning={{ sameWidth: true, placement: "bottom" }}
            collection={collection}
            value={[value]}
            onValueChange={(details) => {
                setSettings(id, {
                    [targetKey]: details.value[0],
                });
            }}
            {...rest}
        >
            <Select.HiddenSelect />
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder={"Выберите параметр"} />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            {noPortal ? content : <Portal>{content}</Portal>}
        </Select.Root>
    );
});
