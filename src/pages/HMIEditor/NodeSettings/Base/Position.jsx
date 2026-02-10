import { Fieldset, Group, InputGroup, NumberInput } from "@chakra-ui/react";
import { patchStoreRaf } from "../../store/node-store";
import { sameCheck, useNodesByIds } from "../utils";
import { LOCALE } from "../../constants";

function updateAxis(ids, value, axis) {
    let val = Number.isNaN(value) ? 0 : value;
    const patch = {};
    ids.forEach((id) => {
        patch[id] = { [axis]: val };
    });
    patchStoreRaf(ids, patch);
}

export const PositionBlock = ({ ids }) => {
    return (
        <Fieldset.Root>
            <Fieldset.Legend>{LOCALE.position}</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <PositionAxis ids={ids} axis="x" label="X" />
                    <PositionAxis ids={ids} axis="y" label="Y" />
                </Group>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};

const PositionAxis = ({ ids, axis, label }) => {
    const values = useNodesByIds(ids, axis);
    const value = sameCheck(values);

    const handleChange = (value) => {
        updateAxis(ids, value, axis);
    };

    return (
        <NumberInput.Root
            size={"xs"}
            value={value}
            onValueChange={(e) => handleChange(e.valueAsNumber)}
        >
            <NumberInput.Control />
            <InputGroup
                startElementProps={{
                    pointerEvents: "auto",
                }}
                startElement={
                    <NumberInput.Scrubber>{label}</NumberInput.Scrubber>
                }
            >
                <NumberInput.Input />
            </InputGroup>
        </NumberInput.Root>
    );
};
