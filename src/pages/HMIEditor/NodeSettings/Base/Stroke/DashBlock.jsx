import {
    createListCollection,
    Field,
    NumberInput,
    Portal,
    Select,
} from "@chakra-ui/react";
import { sameCheck, useNodesByIds } from "../../utils";
import { patchStoreRaf } from "@/pages/HMIEditor/store/node-store";

const lineTypes = createListCollection({
    items: [
        { label: "Mixed", value: "mixed", disabled: true },
        { label: "Solid", value: "solid" },
        { label: "Dashed", value: "dashed" },
    ],
});

function resolveDash(dashes) {
    if (!Array.isArray(dashes) || dashes.length === 0) {
        return { mixed: true, value: [0, 0] };
    }

    const [a, b] = dashes[0] ?? [];
    const same = dashes.every(
        (d) => Array.isArray(d) && d.length === 2 && d[0] === a && d[1] === b,
    );

    return {
        mixed: !same,
        value: same ? [a, b] : [a ?? 0, b ?? 0],
    };
}

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
    const { mixed: dashMixed, value: dash } = resolveDash(dashes);

    const handleTypeChange = (e) => {
        const value = e.value[0];
        if (value === "solid") dashEnabled = false;
        if (value === "dashed") dashEnabled = true;
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { dashEnabled };
        });
        patchStoreRaf(ids, patch);
    };

    const handleDashChange = (value, index) => {
        const val = Number.isNaN(value) ? 0 : value;
        const next = [...dash];

        if (dashMixed) {
            next[0] ??= 4;
            next[1] ??= 4;
        }

        next[index] = val;

        const patch = {};
        ids.forEach((id) => {
            patch[id] = { dash: next };
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
