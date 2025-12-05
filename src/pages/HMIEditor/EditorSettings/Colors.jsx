import { ColorPicker, parseColor } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useActionsStore } from "../store/actions-store";

const PARAMS = [
    { param: "gridColor", label: "Grid color", setter: "setGridColor" },
    {
        param: "backgroundColor",
        label: "Background color",
        setter: "setBackgroundColor",
    },
    {
        param: "workAreaColor",
        label: "Work area color",
        setter: "setWorkAreaColor",
    },
];

export const Colors = () => {
    return PARAMS.map(({ param, label, setter }) => (
        <ColorComp key={param} param={param} label={label} setter={setter} />
    ));
};

export const ColorComp = ({ param, label, setter }) => {
    const storeColor = useActionsStore((state) => state[param]);
    const set = useActionsStore.getState()[setter];
    const [color, setColor] = useState(parseColor(storeColor));

    useEffect(() => {
        if (!storeColor) return;
        setColor(parseColor(storeColor));
    }, [storeColor]);

    return (
        <ColorPicker.Root
            size={"xs"}
            value={color}
            onValueChange={(e) => setColor(e.value)}
            onValueChangeEnd={(e) => set(e.value.toString("hex"))}
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
