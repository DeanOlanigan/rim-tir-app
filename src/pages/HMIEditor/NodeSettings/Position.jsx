import { Fieldset, Group, InputGroup, NumberInput } from "@chakra-ui/react";
import { useState } from "react";

export const PositionBlock = ({ node }) => {
    const { x, y } = node.position();
    const [pos, setPos] = useState({ x, y });

    const handleChangeCoord = (value, type) => {
        const val = Number.isNaN(value) ? 0 : value;
        if (type === "x") {
            node.x(val);
            setPos((prev) => ({ ...prev, x: val }));
        }
        if (type === "y") {
            node.y(val);
            setPos((prev) => ({ ...prev, y: val }));
        }
    };

    return (
        <Fieldset.Root>
            <Fieldset.Legend>Position</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <NumberInput.Root
                        size={"xs"}
                        value={pos.x}
                        onValueChange={(e) =>
                            handleChangeCoord(e.valueAsNumber, "x")
                        }
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>X</NumberInput.Scrubber>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                    </NumberInput.Root>
                    <NumberInput.Root
                        size={"xs"}
                        value={pos.y}
                        onValueChange={(e) =>
                            handleChangeCoord(e.valueAsNumber, "y")
                        }
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>Y</NumberInput.Scrubber>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                    </NumberInput.Root>
                </Group>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};
