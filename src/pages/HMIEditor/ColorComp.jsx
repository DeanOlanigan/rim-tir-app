import { ColorPicker, parseColor } from "@chakra-ui/react";
import { useState } from "react";

export const ColorComp = ({ outerColor, setOuterColor, label }) => {
    const [color, setColor] = useState(parseColor(outerColor));

    return (
        <ColorPicker.Root
            size={"xs"}
            value={color}
            onValueChange={(e) => setColor(e.value)}
            onValueChangeEnd={(e) => setOuterColor(e.value.toString("hex"))}
        >
            <ColorPicker.HiddenInput />
            <ColorPicker.Label>{label}</ColorPicker.Label>
            <ColorPicker.Control>
                <ColorPicker.Trigger />
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
