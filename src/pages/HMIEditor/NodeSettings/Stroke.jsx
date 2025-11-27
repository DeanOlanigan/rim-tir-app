import {
    ColorPicker,
    Fieldset,
    Group,
    Heading,
    InputGroup,
    NumberInput,
    parseColor,
    Slider,
    VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdLineWeight } from "react-icons/md";

export const StrokeBlock = ({ node }) => {
    return (
        <VStack align={"start"} w={"100%"}>
            <Heading size={"md"}>Stroke</Heading>
            <StrokeColorSolid node={node} />
            <StrokeWeightBlock node={node} />
        </VStack>
    );
};

const StrokeColorSolid = ({ node }) => {
    const fill = node.stroke() ?? "#000000";
    const [color, setColor] = useState(parseColor(fill));

    const handleChangeColor = (color) => {
        node.stroke(color);
    };

    return (
        <ColorPicker.Root
            size={"xs"}
            value={color}
            onValueChange={(e) => setColor(e.value)}
            onValueChangeEnd={(e) => handleChangeColor(e.valueAsString)}
            lazyMount
            unmountOnExit
        >
            <ColorPicker.HiddenInput />
            <ColorPicker.Control>
                <ColorPicker.Trigger />
                <ColorPicker.Input />
            </ColorPicker.Control>
            <ColorPicker.Positioner>
                <ColorPicker.Content>
                    <ColorPicker.Area />
                    <ColorPicker.Sliders />
                </ColorPicker.Content>
            </ColorPicker.Positioner>
        </ColorPicker.Root>
    );
};

const StrokeWeightBlock = ({ node }) => {
    const strokeWidth = node.strokeWidth();
    const [weight, setWeight] = useState(strokeWidth);

    const handleWeight = (value) => {
        let val = value;
        if (Number.isNaN(value)) val = 0;
        node.strokeWidth(val);
        setWeight(val);
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
