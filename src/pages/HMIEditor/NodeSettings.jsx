import {
    Box,
    Fieldset,
    Group,
    HStack,
    IconButton,
    Presence,
    Slider,
} from "@chakra-ui/react";
import { useActionsStore } from "./store/actions-store";
import { useShapeStore } from "./store/shape-store";
import { useNodeStore } from "./store/node-store";
import { ColorComp } from "./ColorComp";
import {
    LuArrowDownFromLine,
    LuArrowUpFromLine,
    LuMoveDown,
    LuMoveUp,
} from "react-icons/lu";
import { ACTIONS } from "./constants";

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

    const viewSettings =
        NODES_WITH_SETTINGS.includes(currentAction) || selectedIds.length === 1;

    const isRectangleSelected =
        selectedIds.length === 1 &&
        canvasRef.current.findOne(`#${selectedIds[0]}`).attrs.type === "rect";

    const showCornerRadius =
        currentAction === ACTIONS.square ||
        (isRectangleSelected && selectedIds.length === 1);

    const defaultFillColor =
        selectedIds.length === 1
            ? canvasRef.current.findOne(`#${selectedIds[0]}`).fill()
            : fillColor;

    const fillColorHandler = (color) => {
        if (selectedIds.length === 1) {
            canvasRef.current.findOne(`#${selectedIds[0]}`).fill(color);
        } else {
            setFillColor(color);
        }
    };

    const defaultStrokeColor =
        selectedIds.length === 1
            ? canvasRef.current.findOne(`#${selectedIds[0]}`).stroke()
            : strokeColor;

    const strokeColorHandler = (color) => {
        if (selectedIds.length === 1) {
            canvasRef.current.findOne(`#${selectedIds[0]}`).stroke(color);
        } else {
            setStrokeColor(color);
        }
    };

    return (
        <Presence
            present={viewSettings}
            animationName={{ _open: "fade-in", _closed: "fade-out" }}
            animationDuration="moderate"
        >
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
                        {/* <ColorComp
                            label={"Fill color"}
                            outerColor={defaultFillColor}
                            setOuterColor={fillColorHandler}
                        /> */}
                        <ColorComp
                            label={"Stroke color"}
                            outerColor={defaultStrokeColor}
                            setOuterColor={strokeColorHandler}
                        />
                        <StrokeWidth
                            canvasRef={canvasRef}
                            selectedIds={selectedIds}
                        />
                        {showCornerRadius && (
                            <CornerRadius
                                canvasRef={canvasRef}
                                selectedIds={selectedIds}
                            />
                        )}
                        <Layers
                            canvasRef={canvasRef}
                            selectedIds={selectedIds}
                        />
                    </Fieldset.Content>
                </Fieldset.Root>
            </Box>
        </Presence>
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

const Layers = ({ canvasRef, selectedIds }) => {
    return (
        <Group attached grow>
            <IconButton
                size={"xs"}
                onClick={() => {
                    if (selectedIds.length === 1) {
                        canvasRef.current
                            .findOne(`#${selectedIds[0]}`)
                            .moveToTop();
                    }
                }}
            >
                <LuArrowUpFromLine />
            </IconButton>
            <IconButton
                size={"xs"}
                onClick={() => {
                    if (selectedIds.length === 1) {
                        canvasRef.current
                            .findOne(`#${selectedIds[0]}`)
                            .moveUp();
                    }
                }}
            >
                <LuMoveUp />
            </IconButton>
            <IconButton
                size={"xs"}
                onClick={() => {
                    if (selectedIds.length === 1) {
                        canvasRef.current
                            .findOne(`#${selectedIds[0]}`)
                            .moveDown();
                    }
                }}
            >
                <LuMoveDown />
            </IconButton>
            <IconButton
                size={"xs"}
                onClick={() => {
                    if (selectedIds.length === 1) {
                        canvasRef.current
                            .findOne(`#${selectedIds[0]}`)
                            .moveToBottom();
                    }
                }}
            >
                <LuArrowDownFromLine />
            </IconButton>
        </Group>
    );
};
