import { useState } from "react";
import { patchNodeThrottled } from "../utils";
import {
    Fieldset,
    Group,
    InputGroup,
    NumberInput,
    Slider,
} from "@chakra-ui/react";
import { MdLineWeight } from "react-icons/md";

export const StrokeWeightBlock = ({ node }) => {
    const strokeWidth = node.strokeWidth();
    const [weight, setWeight] = useState(strokeWidth);

    const handleWeight = (value) => {
        let val = value;
        if (Number.isNaN(value)) val = 0;
        node.strokeWidth(val);
        setWeight(val);
        patchNodeThrottled(node.id(), { strokeWidth: val });
    };

    return (
        <Fieldset.Root>
            <Fieldset.Legend>Weight</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <NumberInput.Root
                        size={"xs"}
                        min={0}
                        max={100}
                        value={weight}
                        onValueChange={(e) => handleWeight(e.valueAsNumber)}
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>
                                    <MdLineWeight />
                                </NumberInput.Scrubber>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                    </NumberInput.Root>
                    <Slider.Root
                        size={"sm"}
                        w={"100%"}
                        value={[weight]}
                        onValueChange={(e) => handleWeight(e.value[0])}
                    >
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Range />
                            </Slider.Track>
                            <Slider.Thumbs />
                        </Slider.Control>
                    </Slider.Root>
                </Group>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};
