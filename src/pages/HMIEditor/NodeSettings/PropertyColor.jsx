import { ColorPicker, parseColor } from "@chakra-ui/react";
import { applyPatch, sameCheck, useEffectiveParamsByIds } from "./utils";
import { useInteractiveStore } from "../store/interactive-store";

export const PropertyColor = ({ ids, property }) => {
    const values = useEffectiveParamsByIds(ids, property);
    const base = sameCheck(values) || values[0] || "#000000";
    const value = parseColor(base);

    const ensureInteractive = () => {
        const int = useInteractiveStore.getState();
        if (!int.active) int.begin();
    };

    const handleChangeColor = (color, undoable) => {
        const patch = {};
        for (const id of ids) patch[id] = { [property]: color };
        applyPatch(patch, undoable);
    };

    return (
        <ColorPicker.Root
            size={"xs"}
            value={value}
            onValueChange={(e) => {
                ensureInteractive();
                handleChangeColor(e.valueAsString, false);
            }}
            onValueChangeEnd={(e) => {
                handleChangeColor(e.valueAsString, true);
            }}
            onOpenChange={(e) => {
                const int = useInteractiveStore.getState();
                if (e.open) int.begin();
                else int.cancel();
            }}
            onExitComplete={() => {
                useInteractiveStore.getState().cancel();
            }}
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
