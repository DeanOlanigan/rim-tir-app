import { ColorPicker, parseColor } from "@chakra-ui/react";
import { applyPatch, sameCheck, useNodesByIds } from "./utils";
import { useNodeStore } from "../store/node-store";

export const PropertyColor = ({ ids, property }) => {
    const values = useNodesByIds(ids, property);
    const value = parseColor(sameCheck(values) || values[0]);
    const store = useNodeStore.getState();

    const handleChangeColor = (color, undoable) => {
        const patch = {};
        for (const id of ids) patch[id] = { [property]: color };
        applyPatch(patch, undoable, [property]);
    };

    return (
        <ColorPicker.Root
            size={"xs"}
            value={value}
            onValueChange={(e) => handleChangeColor(e.valueAsString, false)}
            onValueChangeEnd={(e) => {
                handleChangeColor(e.valueAsString, true);
                store.beginInteractiveSnapshot(ids, [property]);
            }}
            onOpenChange={(e) => {
                if (e.open) {
                    store.beginInteractiveSnapshot(ids, [property]);
                }
            }}
            onExitComplete={() => {
                store.clearInteractiveSnapshot();
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
