import {
    createListCollection,
    Field,
    NumberInput,
    Portal,
    Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { patchNodeThrottled } from "../utils";

const lineTypes = createListCollection({
    items: [
        { label: "Solid", value: "solid" },
        { label: "Dashed", value: "dashed" },
    ],
});

export const DashBlock = ({ node }) => {
    const [value, setValue] = useState([
        node.dashEnabled() ? "dashed" : "solid",
    ]);
    const [dashArray, setDashArray] = useState(node.dash() || [0, 0]);

    const handleTypeChange = (e) => {
        setValue(e.value);
        if (e.value[0] === "solid") {
            node.dashEnabled(false);
            patchNodeThrottled(node.id(), { dashEnabled: false });
        } else {
            node.dashEnabled(true);
            patchNodeThrottled(node.id(), { dashEnabled: true });
        }
    };

    const handleDashChange = (value, index) => {
        const val = Number.isNaN(value) ? 0 : value;
        const newDashArray = [...dashArray];
        newDashArray[index] = val;
        setDashArray(newDashArray);
        node.dash(newDashArray);
        patchNodeThrottled(node.id(), { dash: newDashArray });
    };

    return (
        <>
            <Select.Root
                size={"xs"}
                collection={lineTypes}
                value={value}
                onValueChange={handleTypeChange}
                lazyMount
                unmountOnExit
            >
                <Select.HiddenSelect />
                <Select.Label>Dash</Select.Label>
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
                            {lineTypes.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                    {item.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
            {value[0] === "dashed" && (
                <>
                    <Field.Root orientation="horizontal">
                        <Field.Label>Dash</Field.Label>
                        <NumberInput.Root
                            size={"xs"}
                            flex={1}
                            value={dashArray[0]}
                            onValueChange={(e) =>
                                handleDashChange(e.valueAsNumber, 0)
                            }
                        >
                            <NumberInput.Control />
                            <NumberInput.Input />
                        </NumberInput.Root>
                    </Field.Root>
                    <Field.Root orientation="horizontal">
                        <Field.Label>Gap</Field.Label>
                        <NumberInput.Root
                            size={"xs"}
                            flex={1}
                            value={dashArray[1]}
                            onValueChange={(e) =>
                                handleDashChange(e.valueAsNumber, 1)
                            }
                        >
                            <NumberInput.Control />
                            <NumberInput.Input />
                        </NumberInput.Root>
                    </Field.Root>
                </>
            )}
        </>
    );
};
