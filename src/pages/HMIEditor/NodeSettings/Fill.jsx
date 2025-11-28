import { ColorPicker, Heading, parseColor, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useNodeStore } from "../store/node-store";

export const FillBlock = ({ node }) => {
    return (
        <VStack align={"start"} w={"100%"}>
            <Heading size={"md"}>Fill</Heading>
            <FillColorSolid node={node} />
        </VStack>
    );
};

const FillColorSolid = ({ node }) => {
    const fill = node.fill() ?? "#000000";
    const [color, setColor] = useState(parseColor(fill));

    const handleChangeColor = (e) => {
        node.fill(e.valueAsString);
        setColor(e.value);
    };

    const handleChangeColorEnd = (color) => {
        useNodeStore.getState().updateNode(node.id(), { fill: color });
    };

    return (
        <ColorPicker.Root
            size={"xs"}
            value={color}
            onValueChange={(e) => handleChangeColor(e)}
            onValueChangeEnd={(e) => handleChangeColorEnd(e.valueAsString)}
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
