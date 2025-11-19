import {
    Box,
    ColorPicker,
    Fieldset,
    HStack,
    IconButton,
    parseColor,
    Slider,
} from "@chakra-ui/react";
import { useActionsStore } from "./store/actions-store";
import { ACTIONS } from "./store/actions";
import { useState } from "react";
import { useShapeStore } from "./store/shape-store";
import { useNodeStore } from "./store/node-store";
import { ColorComp } from "./ColorComp";
import { LuArrowDown, LuArrowUp } from "react-icons/lu";

const NODES_WITH_SETTINGS = [
    ACTIONS.square,
    ACTIONS.ellipse,
    ACTIONS.text,
    ACTIONS.arrow,
    ACTIONS.line,
];

export const NodeSettings = ({ canvasRef }) => {
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
                    <StrokeWidth
                        canvasRef={canvasRef}
                        selectedIds={selectedIds}
                    />
                    {currentAction === ACTIONS.square ||
                        (selectedIds.length === 1 &&
                            canvasRef.current.findOne(`#${selectedIds[0]}`)
                                .attrs.type === "rect" && (
                                <CornerRadius
                                    canvasRef={canvasRef}
                                    selectedIds={selectedIds}
                                />
                            ))}
                    <MoveToTopBtn
                        canvasRef={canvasRef}
                        selectedIds={selectedIds}
                    />
                    <MoveToBottomBtn
                        canvasRef={canvasRef}
                        selectedIds={selectedIds}
                    />
                </Fieldset.Content>
            </Fieldset.Root>
        </Box>
    );
};

const StrokeWidth = ({ canvasRef, selectedIds }) => {
    const strokeWidth = useShapeStore((state) => state.strokeWidth);
    const setStrokeWidth = useShapeStore((state) => state.setStrokeWidth);

    const defaultValue =
        selectedIds.length === 1
            ? canvasRef.current.findOne(`#${selectedIds[0]}`).strokeWidth()
            : strokeWidth;

    return (
        <Slider.Root
            defaultValue={[defaultValue]}
            onValueChange={(e) => {
                if (selectedIds.length === 1) {
                    canvasRef.current
                        .findOne(`#${selectedIds[0]}`)
                        .strokeWidth(e.value[0]);
                } else {
                    setStrokeWidth(e.value[0]);
                }
            }}
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

const CornerRadius = ({ canvasRef, selectedIds }) => {
    const cornerRadius = useShapeStore((state) => state.cornerRadius);
    const setCornerRadius = useShapeStore((state) => state.setCornerRadius);

    const defaultValue =
        selectedIds.length === 1
            ? canvasRef.current.findOne(`#${selectedIds[0]}`).cornerRadius()
            : cornerRadius;

    return (
        <Slider.Root
            defaultValue={[defaultValue]}
            onValueChange={(e) => {
                if (selectedIds.length === 1) {
                    canvasRef.current
                        .findOne(`#${selectedIds[0]}`)
                        .cornerRadius(e.value[0]);
                } else {
                    setCornerRadius(e.value[0]);
                }
            }}
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

const MoveToTopBtn = ({ canvasRef, selectedIds }) => {
    return (
        <IconButton
            onClick={() => {
                if (selectedIds.length === 1) {
                    canvasRef.current.findOne(`#${selectedIds[0]}`).moveToTop();
                }
            }}
        >
            <LuArrowUp />
        </IconButton>
    );
};

const MoveToBottomBtn = ({ canvasRef, selectedIds }) => {
    return (
        <IconButton
            onClick={() => {
                if (selectedIds.length === 1) {
                    canvasRef.current
                        .findOne(`#${selectedIds[0]}`)
                        .moveToBottom();
                }
            }}
        >
            <LuArrowDown />
        </IconButton>
    );
};
