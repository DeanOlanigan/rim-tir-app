import { ColorPicker, Heading, parseColor, VStack } from "@chakra-ui/react";
import { sameCheck, useNodesByIds } from "./utils";
import { patchStoreRaf } from "../store/node-store";

export const FillBlock = ({ ids }) => {
    return (
        <VStack align={"start"} w={"100%"}>
            <Heading size={"md"}>Fill</Heading>
            <FillColorSolid ids={ids} />
        </VStack>
    );
};

const FillColorSolid = ({ ids }) => {
    const fills = useNodesByIds(ids, "fill");
    const fill = parseColor(sameCheck(fills) || fills[0]);

    const handleChangeColor = (fill) => {
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { fill };
        });
        patchStoreRaf(ids, patch);
    };

    // eslint-disable-next-line
    const handleChangeColorEnd = (fill) => {
        //TODO Добавить undo/redo
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { fill };
        });
        patchStoreRaf(ids, patch);
    };

    return (
        <ColorPicker.Root
            size={"xs"}
            value={fill}
            onValueChange={(e) => handleChangeColor(e.valueAsString)}
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
