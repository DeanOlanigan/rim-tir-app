import {
    createListCollection,
    Field,
    NumberInput,
    Portal,
    Select,
} from "@chakra-ui/react";
import { sameCheck, useNodesByIds } from "../utils";
import { patchStoreRaf } from "../../store/node-store";

const lineTypes = createListCollection({
    items: [
        { label: "Mixed", value: "mixed", disabled: true },
        { label: "Solid", value: "solid" },
        { label: "Dashed", value: "dashed" },
    ],
});

export const DashBlock = ({ ids }) => {
    const allDashEnabled = useNodesByIds(ids, "dashEnabled");
    let dashEnabled = sameCheck(allDashEnabled);

    switch (dashEnabled) {
        case true:
            dashEnabled = "dashed";
            break;
        case false:
            dashEnabled = "solid";
            break;
        default:
            dashEnabled = "mixed";
            break;
    }

    const dashes = useNodesByIds(ids, "dash");
    const firstDash = dashes[0];
    // TODO очень хрупкая проверка
    const dash = dashes.every(
        (d) => d[0] === firstDash[0] && d[1] === firstDash[1],
    )
        ? firstDash
        : ["", ""];

    const handleTypeChange = (e) => {
        let dashEnabled = e.value[0] === "solid" ? false : true;
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { dashEnabled };
        });
        patchStoreRaf(ids, patch);
    };

    const handleDashChange = (value, index) => {
        const val = Number.isNaN(value) ? 0 : value;
        const newDashArray = [...dash];
        newDashArray[index] = val;
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { dash: newDashArray };
        });
        patchStoreRaf(ids, patch);
    };

    return (
        <>
            <Select.Root
                size={"xs"}
                collection={lineTypes}
                value={[dashEnabled]}
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
            {dashEnabled === "dashed" && (
                <>
                    <Field.Root orientation="horizontal">
                        <Field.Label>Dash</Field.Label>
                        <NumberInput.Root
                            size={"xs"}
                            flex={1}
                            value={dash[0]}
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
                            value={dash[1]}
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
