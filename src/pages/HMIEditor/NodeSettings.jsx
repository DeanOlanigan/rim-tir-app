import {
    Box,
    ColorPicker,
    Fieldset,
    HStack,
    parseColor,
    Slider,
} from "@chakra-ui/react";
import { useActionsStore } from "./store/actions-store";
import { ACTIONS } from "./store/actions";
import { useState } from "react";
import { useShapeStore } from "./store/shape-store";
import { useNodeStore } from "./store/node-store";
import { ColorComp } from "./ColorComp";

const NODES_WITH_SETTINGS = [
    ACTIONS.square,
    ACTIONS.ellipse,
    ACTIONS.text,
    ACTIONS.arrow,
    ACTIONS.line,
];

export const NodeSettings = () => {
    const currentAction = useActionsStore((state) => state.currentAction);
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const fillColor = useShapeStore((state) => state.fillColor);
    const strokeColor = useShapeStore((state) => state.strokeColor);
    const { setFillColor, setStrokeColor } = useShapeStore.getState();

    if (
        !NODES_WITH_SETTINGS.includes(currentAction) &&
        selectedIds.length !== 1
    )
        return null;

    return (
        <Box
            bg={"bg"}
            w={"350px"}
            h={"100%"}
            p={"4"}
            borderRadius={"md"}
            shadow={"md"}
        >
            <Fieldset.Root>
                <Fieldset.Legend>NodeSettings</Fieldset.Legend>
                <Fieldset.Content>
                    <ColorComp
                        label={"Fill color"}
                        outerColor={fillColor}
                        setOuterColor={setFillColor}
                    />
                    <ColorComp
                        label={"Stroke color"}
                        outerColor={strokeColor}
                        setOuterColor={setStrokeColor}
                    />
                    <StrokeWidth />
                    {currentAction === ACTIONS.square && <CornerRadius />}
                </Fieldset.Content>
            </Fieldset.Root>
        </Box>
    );
};

const StrokeWidth = () => {
    const strokeWidth = useShapeStore((state) => state.strokeWidth);
    const setStrokeWidth = useShapeStore((state) => state.setStrokeWidth);
    return (
        <Slider.Root
            value={[strokeWidth]}
            onValueChange={(e) => setStrokeWidth(e.value[0])}
            step={1}
            min={0}
            max={10}
            size={"sm"}
            maxW={"sm"}
        >
            <HStack justify="space-between">
                <Slider.Label>Stroke width</Slider.Label>
                <Slider.ValueText />
            </HStack>
            <Slider.Control>
                <Slider.Track>
                    <Slider.Range />
                </Slider.Track>
                <Slider.Thumb />
            </Slider.Control>
        </Slider.Root>
    );
};

const CornerRadius = () => {
    const cornerRadius = useShapeStore((state) => state.cornerRadius);
    const setCornerRadius = useShapeStore((state) => state.setCornerRadius);
    return (
        <Slider.Root
            value={[cornerRadius]}
            onValueChange={(e) => setCornerRadius(e.value[0])}
            step={1}
            min={0}
            max={10}
            size={"sm"}
            maxW={"sm"}
        >
            <HStack justify="space-between">
                <Slider.Label>Corner radius</Slider.Label>
                <Slider.ValueText />
            </HStack>
            <Slider.Control>
                <Slider.Track>
                    <Slider.Range />
                </Slider.Track>
                <Slider.Thumb />
            </Slider.Control>
        </Slider.Root>
    );
};
