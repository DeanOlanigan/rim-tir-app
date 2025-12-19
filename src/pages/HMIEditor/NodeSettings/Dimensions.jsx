import {
    Fieldset,
    Group,
    IconButton,
    InputGroup,
    NumberInput,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuProportions } from "react-icons/lu";
import { isLineLikeType } from "../utils";
import { patchStoreRaf, useNodeStore } from "../store/node-store";
import { collectSelectionDimensions, useNodesByIds } from "./utils";
import { changeLineDim } from "../canvas/services/shapeTransforms";

/**
 * Если вдруг ты в будущем будешь уметь менять тип фигуры
 * (rect → line или наоборот) или добавишь какой-нибудь
 * “change primitive type” — DimensionsBlock может продолжать
 * считать, что это “не линия”, пока не изменится что-то ещё
 * (width/height или ids).
 */
function getType(id) {
    return useNodeStore.getState().nodes[id].type;
}

export const DimensionsBlock = ({ ids, api }) => {
    const widths = useNodesByIds(ids, "width");
    const heights = useNodesByIds(ids, "height");
    const { width, height } = collectSelectionDimensions(
        api,
        ids,
        getType,
        widths,
        heights,
    );

    const [aspectRatio, setAspectRatio] = useState(false);

    const handleChangeDim = (value, type) => {
        const val = Number.isNaN(value) ? 0 : value;
        const patch = {};

        ids.forEach((id) => {
            const t = getType(id);
            const isLineLike = isLineLikeType(t);

            if (isLineLike) {
                const res = changeLineDim(api, id, type, aspectRatio, val);
                if (res) patch[id] = res;
            } else {
                if (aspectRatio) {
                    const target = Math.max(val, 0);
                    patch[id] = {
                        width: target,
                        height: target,
                    };
                } else {
                    const target = Math.max(val, 0);
                    patch[id] = {
                        [type]: target,
                    };
                }
            }
        });

        patchStoreRaf(ids, patch);
    };

    const toggleAspectRatio = () => {
        setAspectRatio((prev) => !prev);
    };

    return (
        <Fieldset.Root>
            <Fieldset.Legend>Dimensions</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <DimensionInput
                        value={width}
                        label="W"
                        onChange={(v) => handleChangeDim(v, "width")}
                    />
                    <DimensionInput
                        value={height}
                        label="H"
                        onChange={(v) => handleChangeDim(v, "height")}
                    />
                    <IconButton
                        size={"xs"}
                        variant={aspectRatio ? "solid" : "outline"}
                        onClick={toggleAspectRatio}
                    >
                        <LuProportions />
                    </IconButton>
                </Group>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};

const DimensionInput = ({ value, label, onChange }) => {
    return (
        <NumberInput.Root
            size={"xs"}
            min={0}
            value={value}
            onValueChange={(e) => onChange(e.valueAsNumber)}
        >
            <NumberInput.Control />
            <InputGroup
                startElementProps={{
                    pointerEvents: "auto",
                }}
                startElement={
                    <NumberInput.Scrubber>{label}</NumberInput.Scrubber>
                }
            >
                <NumberInput.Input />
            </InputGroup>
        </NumberInput.Root>
    );
};
