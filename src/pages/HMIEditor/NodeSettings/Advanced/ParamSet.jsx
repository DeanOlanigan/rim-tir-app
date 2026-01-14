import { ColorPicker, Input, parseColor } from "@chakra-ui/react";
import { useState } from "react";

export const ParamSet = ({ type }) => {
    switch (type) {
        case "color":
            return <ColorSetter />;
        case "number":
            return <Input w={"120px"} size={"xs"} />;
        default:
            return null;
    }
};

const ColorSetter = () => {
    const [fill, setFill] = useState(parseColor("#ff0000"));

    const handleChangeColor = (fill) => {
        setFill(fill);
    };

    return (
        <ColorPicker.Root
            size={"xs"}
            value={fill}
            onValueChange={(e) => handleChangeColor(e.value)}
            //onValueChangeEnd={(e) => handleChangeColorEnd(e.valueAsString)}
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
