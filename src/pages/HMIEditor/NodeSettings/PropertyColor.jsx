import { ColorPicker, parseColor } from "@chakra-ui/react";
import { sameCheck, useNodesByIds } from "./utils";
import { patchStoreRaf, useNodeStore } from "../store/node-store";

export const PropertyColor = ({ ids, property }) => {
    const values = useNodesByIds(ids, property);
    const value = parseColor(sameCheck(values) || values[0]);

    const handleChangeColor = (color, undoable) => {
        const patch = {};

        for (const id of ids) patch[id] = { [property]: color };

        if (undoable) {
            patchStoreRaf.flushNow?.();
            useNodeStore.getState().updateNodes(patch);
        } else {
            patchStoreRaf(patch);
        }
    };

    return (
        <ColorPicker.Root
            size={"xs"}
            value={value}
            onValueChange={(e) => handleChangeColor(e.valueAsString, false)}
            onValueChangeEnd={(e) => handleChangeColor(e.valueAsString, true)}
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
