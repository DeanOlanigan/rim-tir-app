import { createListCollection, Portal, Select } from "@chakra-ui/react";
import { useAdvancedSettingsUi } from "./store";

const ruleTypes = createListCollection({
    items: [
        { label: "Map", value: "map" },
        { label: "Threshold", value: "threshold" },
    ],
});

export const RuleTypeSelect = () => {
    const ruleType = useAdvancedSettingsUi((state) => state.ruleType);

    return (
        <Select.Root
            size="xs"
            value={[ruleType]}
            onValueChange={(e) =>
                useAdvancedSettingsUi.getState().setRuleType(e.value[0])
            }
            collection={ruleTypes}
            lazyMount
            unmountOnExit
        >
            <Select.HiddenSelect />
            <Select.Label>Rule type</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Select rule type" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {ruleTypes.items.map((item) => (
                            <Select.Item
                                key={item.value}
                                item={item}
                                value={item.value}
                            >
                                {item.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};
