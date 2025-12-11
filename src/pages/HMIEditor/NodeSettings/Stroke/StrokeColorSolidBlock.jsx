import { ColorPicker, parseColor } from "@chakra-ui/react";
import { sameCheck, useNodesByIds } from "../utils";
import { patchStoreRaf } from "../../store/node-store";

export const StrokeColorSolidBlock = ({ ids }) => {
    const strokes = useNodesByIds(ids, "stroke");
    const stroke = parseColor(sameCheck(strokes) || strokes[0]);

    const handleChangeColor = (stroke) => {
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { stroke };
        });
        patchStoreRaf(ids, patch);
    };

    //TODO вернуть onValueChangeEnd

    return (
        <ColorPicker.Root
            size={"xs"}
            value={stroke}
            onValueChange={(e) => handleChangeColor(e.valueAsString)}
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
