import {
    createListCollection,
    NumberInput,
    Portal,
    Select,
    Text,
} from "@chakra-ui/react";
import { RuleList } from "./RuleList";
import { LOCALE } from "../../constants";

const thresholdRange = createListCollection({
    items: [
        { label: LOCALE.lessThan, value: "lt" },
        { label: LOCALE.greaterThan, value: "gt" },
        { label: LOCALE.between, value: "between" },
    ],
});

const ThresholdRangeSelector = ({ value, onChange }) => {
    return (
        <Select.Root
            size="xs"
            width={"100px"}
            value={[value]}
            onValueChange={(e) => onChange(e.value[0])}
            collection={thresholdRange}
            lazyMount
            unmountOnExit
        >
            <Select.HiddenSelect />
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {thresholdRange.items.map((item) => (
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

export const ThresholdEditor = (props) => {
    return (
        <RuleList
            {...props}
            title={LOCALE.thresholdEditor}
            emptyText={LOCALE.noRulesSet}
            createRule={() => ({ type: "lt", from: 0, to: 0 })}
            renderInput={(rule, i, onChange) => (
                <>
                    <ThresholdRangeSelector
                        value={rule.type ?? "lt"}
                        onChange={(val) => onChange(i, "type", val)}
                    />
                    <NumberInput.Root
                        w={"70px"}
                        size={"xs"}
                        value={rule.from ?? ""}
                        onValueChange={(e) =>
                            onChange(i, "from", e.valueAsNumber)
                        }
                    >
                        <NumberInput.Control />
                        <NumberInput.Input />
                    </NumberInput.Root>

                    {rule.type === "between" && (
                        <>
                            <Text fontSize="xs" color="fg.muted">
                                &
                            </Text>
                            <NumberInput.Root
                                w={"70px"}
                                size={"xs"}
                                value={rule.to ?? ""}
                                onValueChange={(e) =>
                                    onChange(i, "to", e.valueAsNumber)
                                }
                            >
                                <NumberInput.Control />
                                <NumberInput.Input />
                            </NumberInput.Root>
                        </>
                    )}
                </>
            )}
        />
    );
};
