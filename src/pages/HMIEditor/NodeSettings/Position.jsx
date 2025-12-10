import { Fieldset, Group, InputGroup, NumberInput } from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import { sameCheck, useNodesByIds } from "./utils";

export const PositionBlock = ({ ids }) => {
    return (
        <Fieldset.Root>
            <Fieldset.Legend>Position</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <PositionX ids={ids} />
                    <PositionY ids={ids} />
                </Group>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};

const PositionY = ({ ids }) => {
    const ys = useNodesByIds(ids, "y");
    const y = sameCheck(ys);

    const handleChange = (value) => {
        let val = Number.isNaN(value) ? 0 : value;
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { y: val };
        });
        useNodeStore.getState().updateNodes(ids, patch);
    };

    return (
        <NumberInput.Root
            size={"xs"}
            value={y}
            onValueChange={(e) => handleChange(e.valueAsNumber)}
        >
            <NumberInput.Control />
            <InputGroup
                startElementProps={{
                    pointerEvents: "auto",
                }}
                startElement={<NumberInput.Scrubber>Y</NumberInput.Scrubber>}
            >
                <NumberInput.Input />
            </InputGroup>
        </NumberInput.Root>
    );
};

const PositionX = ({ ids }) => {
    const xs = useNodesByIds(ids, "x");
    const x = sameCheck(xs);

    const handleChange = (value) => {
        let val = Number.isNaN(value) ? 0 : value;
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { x: val };
        });
        useNodeStore.getState().updateNodes(ids, patch);
    };

    return (
        <NumberInput.Root
            size={"xs"}
            value={x}
            onValueChange={(e) => handleChange(e.valueAsNumber)}
        >
            <NumberInput.Control />
            <InputGroup
                startElementProps={{
                    pointerEvents: "auto",
                }}
                startElement={<NumberInput.Scrubber>X</NumberInput.Scrubber>}
            >
                <NumberInput.Input />
            </InputGroup>
        </NumberInput.Root>
    );
};
