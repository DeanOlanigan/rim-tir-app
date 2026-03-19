import {
    ColorPicker,
    Input,
    NumberInput,
    parseColor,
    Portal,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const ParamSet = ({ type, value, onChange }) => {
    switch (type) {
        case "color":
            return <ColorSetter value={value} onChange={onChange} />;
        case "number":
            return (
                <NumberInput.Root
                    w={"120px"}
                    size={"xs"}
                    value={value ?? ""}
                    onValueChange={(e) => onChange?.(e.valueAsNumber)}
                >
                    <NumberInput.Control />
                    <NumberInput.Input />
                </NumberInput.Root>
            );
        case "string":
            return (
                <Input
                    w={"120px"}
                    size={"xs"}
                    value={value ?? ""}
                    onChange={(e) => onChange?.(e.target.value)}
                />
            );
        default:
            return null;
    }
};

const ColorSetter = ({ value, onChange }) => {
    const [c, setC] = useState(parseColor(value ?? "#ff0000"));

    useEffect(() => {
        setC(parseColor(value ?? "#ff0000"));
    }, [value]);

    return (
        <ColorPicker.Root
            maxW={"32px"}
            size={"xs"}
            value={c}
            onValueChange={(e) => {
                setC(e.value);
            }}
            onValueChangeEnd={(e) => {
                onChange?.(e.value.toString("hexa"));
            }}
            lazyMount
            unmountOnExit
        >
            <ColorPicker.HiddenInput />
            <ColorPicker.Control>
                <ColorPicker.Trigger />
            </ColorPicker.Control>
            <Portal>
                <ColorPicker.Positioner>
                    <ColorPicker.Content>
                        <ColorPicker.Area />
                        <ColorPicker.Sliders />
                    </ColorPicker.Content>
                </ColorPicker.Positioner>
            </Portal>
        </ColorPicker.Root>
    );
};
