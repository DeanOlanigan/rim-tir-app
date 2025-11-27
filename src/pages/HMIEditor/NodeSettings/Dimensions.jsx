import { Fieldset, Group, InputGroup, NumberInput } from "@chakra-ui/react";
import { useState } from "react";

export const DimensionsBlock = ({ node }) => {
    const { width, height } = node.size();
    const [dim, setDim] = useState({ width, height });

    const handleChangeDim = (value, type) => {
        const val = Number.isNaN(value) ? 0 : value;
        if (type === "width") {
            node.width(val);
            setDim((prev) => ({ ...prev, width: val }));
        }
        if (type === "height") {
            node.height(val);
            setDim((prev) => ({ ...prev, height: val }));
        }
    };

    return (
        <Fieldset.Root>
            <Fieldset.Legend>Dimensions</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <NumberInput.Root
                        size={"xs"}
                        min={0}
                        value={dim.width}
                        onValueChange={(e) =>
                            handleChangeDim(e.valueAsNumber, "width")
                        }
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>W</NumberInput.Scrubber>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                    </NumberInput.Root>
                    <NumberInput.Root
                        size={"xs"}
                        min={0}
                        value={dim.height}
                        onValueChange={(e) =>
                            handleChangeDim(e.valueAsNumber, "height")
                        }
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>H</NumberInput.Scrubber>
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
