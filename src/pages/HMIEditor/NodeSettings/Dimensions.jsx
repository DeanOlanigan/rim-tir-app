import {
    Fieldset,
    Group,
    IconButton,
    InputGroup,
    NumberInput,
} from "@chakra-ui/react";
import { useState } from "react";
import { patchNodeThrottled } from "./utils";
import { LuProportions } from "react-icons/lu";

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
    const [aspectRatio, setAspectRatio] = useState(false);

    /* useEffect(() => {
        setDim({
            width: selectedNode.width,
            height: selectedNode.height,
        });
    }, [selectedNode.width, selectedNode.height, selectedNode.id]); */

    const handleChangeDim = (value, type) => {
        const val = Number.isNaN(value) ? 0 : value;

        if (aspectRatio) {
            node.width(val);
            node.height(val);
            setDim((prev) => ({ ...prev, width: val, height: val }));
            patchNodeThrottled(node.id(), { width: val, height: val });
        } else {
            node[type](val);
            setDim((prev) => ({ ...prev, [type]: val }));
            patchNodeThrottled(node.id(), { [type]: val });
        }
    };

    const toggleAspectRatio = () => {
        setAspectRatio((prev) => !prev);
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
                    <IconButton
                        size={"xs"}
                        variant={aspectRatio ? "solid" : "outline"}
                        onClick={toggleAspectRatio}
                    >
                        <LuProportions />
                    </IconButton>
                </Group>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};
