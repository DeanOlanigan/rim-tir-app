import { ColorPicker, parseColor } from "@chakra-ui/react";
import { useState } from "react";
import { useNodeStore } from "../../store/node-store";

export const StrokeColorSolidBlock = ({ node }) => {
    const fill = node.stroke() ?? "#000000";
    const [color, setColor] = useState(parseColor(fill));

    const handleChangeColor = (e) => {
        node.stroke(e.valueAsString);
        setColor(e.value);
    };

    const handleChangeColorEnd = (color) => {
        useNodeStore.getState().updateNode(node.id(), { stroke: color });
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
