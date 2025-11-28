import { Fieldset, Group, InputGroup, NumberInput } from "@chakra-ui/react";
import { useState } from "react";
import { patchNodeThrottled } from "./utils";

export const DimensionsBlock = ({ node }) => {
    /* const selectedNode = useNodeStore(
        (state) => state.nodes[node.id()],
        (a, b) => a.width === b.width && a.height === b.height
    ); */
    const { width, height } = node.size();
    const [dim, setDim] = useState({
        width,
        height,
    });

    /* useEffect(() => {
        setDim({
            width: selectedNode.width,
            height: selectedNode.height,
        });
    }, [selectedNode.width, selectedNode.height, selectedNode.id]); */

    const handleChangeDim = (value, type) => {
        const val = Number.isNaN(value) ? 0 : value;
        node[type](val);
        setDim((prev) => ({ ...prev, [type]: val }));
        patchNodeThrottled(node.id(), { [type]: val });
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
