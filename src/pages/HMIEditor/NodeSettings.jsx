import {
    Box,
    Fieldset,
    Group,
    HStack,
    IconButton,
    Slider,
} from "@chakra-ui/react";
import { useShapeStore } from "./store/shape-store";
import { useNodeStore } from "./store/node-store";
import { ColorComp } from "./ColorComp";
import {
    LuArrowDownFromLine,
    LuArrowUpFromLine,
    LuMoveDown,
    LuMoveUp,
} from "react-icons/lu";

const SHAPES_WITH_SETTINGS = new Set(["rect", "ellipse", "line", "arrow"]);

export const NodeSettings = ({ canvasRef }) => {
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const nodes = useNodeStore((state) => state.nodes);

    if (
        selectedIds.length !== 1 ||
        !SHAPES_WITH_SETTINGS.has(
            nodes.find((n) => n.id === selectedIds[0]).type
        )
    )
        return null;

    const isRectangleSelected =
        canvasRef.current.findOne(`#${selectedIds[0]}`).attrs.type === "rect";
    const showCornerRadius = isRectangleSelected;

    const defaultFillColor = canvasRef.current
        .findOne(`#${selectedIds[0]}`)
        .fill?.();

    const fillColorHandler = (color) => {
        canvasRef.current.findOne(`#${selectedIds[0]}`).fill(color);
    };

    const defaultStrokeColor = canvasRef.current
        .findOne(`#${selectedIds[0]}`)
        .stroke?.();

    const strokeColorHandler = (color) => {
        canvasRef.current.findOne(`#${selectedIds[0]}`).stroke(color);
    };

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
                    <BaseSettings />
                    <ColorComp
                        label={"Fill color"}
                        outerColor={defaultFillColor}
                        setOuterColor={fillColorHandler}
                    />
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
                    <Layers canvasRef={canvasRef} selectedIds={selectedIds} />
                </Fieldset.Content>
            </Fieldset.Root>
        </Box>
    );
};

const BaseSettings = () => {
    return (
        <HStack>
            <Fieldset.Root>
                <Fieldset.Legend>Position</Fieldset.Legend>
                <Fieldset.Content></Fieldset.Content>
            </Fieldset.Root>
        </HStack>
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
