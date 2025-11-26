import {
    ColorPicker,
    Fieldset,
    Flex,
    Group,
    Heading,
    HStack,
    IconButton,
    InputGroup,
    NumberInput,
    parseColor,
    SimpleGrid,
    Slider,
    Tabs,
    VStack,
} from "@chakra-ui/react";
import {
    LuArrowDownFromLine,
    LuArrowRightLeft,
    LuArrowUpFromLine,
    LuEye,
    LuEyeClosed,
    LuFlipHorizontal2,
    LuFlipVertical2,
    LuMaximize,
    LuMoveDown,
    LuMoveUp,
    LuRotateCwSquare,
} from "react-icons/lu";
import {
    RxCornerBottomLeft,
    RxCornerBottomRight,
    RxCornerTopLeft,
    RxCornerTopRight,
    RxAngle,
} from "react-icons/rx";
import { MdLineWeight } from "react-icons/md";
import { useState } from "react";
import { useNodeStore } from "../store/node-store";
import { useShapeStore } from "../store/shape-store";

const SHAPES_WITH_SETTINGS = new Set(["rect", "ellipse", "line", "arrow"]);

const SHAPES_NAMES = {
    rect: "Rectangle",
    ellipse: "Ellipse",
    line: "Line",
    arrow: "Arrow",
};

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
        <Flex
            bg={"bg"}
            w={"350px"}
            h={"100%"}
            p={"4"}
            borderRadius={"md"}
            shadow={"md"}
        >
            <Tabs.Root
                variant={"subtle"}
                defaultValue="base"
                lazyMount
                unmountOnExit
                fitted
                w={"full"}
            >
                <Tabs.List>
                    <Tabs.Trigger value="base">Base settings</Tabs.Trigger>
                    <Tabs.Trigger value="advanced">Advanced</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="base">
                    <BaseSettings
                        canvasRef={canvasRef}
                        selectedIds={selectedIds}
                        nodes={nodes}
                    />
                </Tabs.Content>
                <Tabs.Content value="advanced">Advanced settings</Tabs.Content>
            </Tabs.Root>
            {/* <Fieldset.Root>
                <Fieldset.Legend>NodeSettings</Fieldset.Legend>
                <Fieldset.Content>
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
            </Fieldset.Root> */}
        </Flex>
    );
};

const BaseSettings = ({ canvasRef, selectedIds }) => {
    const primaryNode = canvasRef.current.findOne(`#${selectedIds[0]}`);
    const type = primaryNode.attrs.type;
    const heading =
        selectedIds.length > 1
            ? `${selectedIds.length} selected`
            : SHAPES_NAMES[primaryNode.attrs.type];
    return (
        <VStack pe={2} overflow={"auto"}>
            <VStack align={"start"}>
                <Heading size={"md"}>{heading}</Heading>
                <PositionBlock node={primaryNode} />
                <DimensionsBlock node={primaryNode} />
                <RotationBlock node={primaryNode} />
            </VStack>
            <VStack align={"start"} w={"100%"}>
                <Heading size={"md"}>Appearance</Heading>
                <OpacityBlock node={primaryNode} />
                {type === "rect" && <CornerRadiusBlock node={primaryNode} />}
            </VStack>
            <FillBlock node={primaryNode} />
            <StrokeBlock node={primaryNode} />
        </VStack>
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

const PositionBlock = ({ node }) => {
    const { x, y } = node.position();
    const [pos, setPos] = useState({ x, y });

    const handleChangeCoord = (e, type) => {
        if (type === "x") {
            node.x(e.valueAsNumber);
            setPos((prev) => ({ ...prev, x: e.valueAsNumber }));
        }
        if (type === "y") {
            node.y(e.valueAsNumber);
            setPos((prev) => ({ ...prev, y: e.valueAsNumber }));
        }
    };

    return (
        <Fieldset.Root>
            <Fieldset.Legend>Position</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <NumberInput.Root
                        size={"xs"}
                        value={pos.x}
                        onValueChange={(e) => handleChangeCoord(e, "x")}
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>X</NumberInput.Scrubber>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                    </NumberInput.Root>
                    <NumberInput.Root
                        size={"xs"}
                        value={pos.y}
                        onValueChange={(e) => handleChangeCoord(e, "y")}
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>Y</NumberInput.Scrubber>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                    </NumberInput.Root>
                </Group>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};

const DimensionsBlock = ({ node }) => {
    const { width, height } = node.size();
    const [dim, setDim] = useState({ width, height });

    const handleChangeDim = (e, type) => {
        if (type === "width") {
            node.width(e.valueAsNumber);
            setDim((prev) => ({ ...prev, width: e.valueAsNumber }));
        }
        if (type === "height") {
            node.height(e.valueAsNumber);
            setDim((prev) => ({ ...prev, height: e.valueAsNumber }));
        }
    };

    return (
        <Fieldset.Root>
            <Fieldset.Legend>Dimensions</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <NumberInput.Root
                        size={"xs"}
                        value={dim.width}
                        onValueChange={(e) => handleChangeDim(e, "width")}
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>W</NumberInput.Scrubber>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                    </NumberInput.Root>
                    <NumberInput.Root
                        size={"xs"}
                        value={dim.height}
                        onValueChange={(e) => handleChangeDim(e, "height")}
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>H</NumberInput.Scrubber>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                    </NumberInput.Root>
                </Group>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};

const RotationBlock = ({ node }) => {
    const [value, setValue] = useState(node.rotation());

    const applyCenteredTransform = (transformFn) => {
        const stage = node.getStage();
        if (!stage) return;

        // центр до трансформации
        const oldRect = node.getClientRect({ relativeTo: stage });
        const oldCenter = {
            x: oldRect.x + oldRect.width / 2,
            y: oldRect.y + oldRect.height / 2,
        };

        // сама трансформация (rotation / flip / что угодно)
        transformFn();

        // центр после трансформации
        const newRect = node.getClientRect({ relativeTo: stage });
        const newCenter = {
            x: newRect.x + newRect.width / 2,
            y: newRect.y + newRect.height / 2,
        };

        // сдвигаем ноду так, чтобы визуальный центр остался на месте
        const dx = oldCenter.x - newCenter.x;
        const dy = oldCenter.y - newCenter.y;

        node.position({
            x: round4(node.x() + dx),
            y: round4(node.y() + dy),
        });
    };

    const handleRotation = (angle) => {
        let val = angle;
        if (Number.isNaN(value)) val = 0;
        const next = toDegIn0To360Range(val);

        applyCenteredTransform(() => {
            node.rotation(next);
        });

        setValue(next);
    };

    const flipHorizontal = () => {
        applyCenteredTransform(() => {
            node.scaleX(node.scaleX() * -1);
        });
        // rotation не меняется, input остаётся с тем же value
    };

    const flipVertical = () => {
        applyCenteredTransform(() => {
            node.scaleY(node.scaleY() * -1);
        });
        // rotation тоже без изменений
    };

    return (
        <Fieldset.Root>
            <Fieldset.Legend>Rotation</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Flex justify={"space-between"}>
                    <NumberInput.Root
                        size={"xs"}
                        allowOverflow={false}
                        value={value}
                        onValueChange={(e) => handleRotation(e.valueAsNumber)}
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>
                                    <RxAngle />
                                </NumberInput.Scrubber>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                    </NumberInput.Root>
                    <Group attached>
                        <IconButton
                            size={"xs"}
                            variant={"outline"}
                            onClick={() => handleRotation(value + 90)}
                        >
                            <LuRotateCwSquare />
                        </IconButton>
                        <IconButton
                            size={"xs"}
                            variant={"outline"}
                            onClick={flipHorizontal}
                        >
                            <LuFlipHorizontal2 />
                        </IconButton>
                        <IconButton
                            size={"xs"}
                            variant={"outline"}
                            onClick={flipVertical}
                        >
                            <LuFlipVertical2 />
                        </IconButton>
                    </Group>
                </Flex>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};

function toDegIn0To360Range(deg) {
    return ((deg % 360) + 360) % 360;
}

function round4(x) {
    return Math.round(x * 1e4) / 1e4;
}

const OpacityBlock = ({ node }) => {
    const opacity = node.opacity() * 100;
    const [value, setValue] = useState(String(opacity));

    const handleOpacity = (value) => {
        let val = value;
        if (Number.isNaN(value)) val = 0;
        node.opacity(val / 100);
        setValue(String(val));
    };

    const toggleOpacity = () => {
        if (node.opacity() === 0) {
            node.opacity(1);
            setValue("100");
        } else {
            node.opacity(0);
            setValue("0");
        }
    };

    return (
        <Fieldset.Root>
            <Fieldset.Legend>Opacity</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <NumberInput.Root
                        size={"xs"}
                        min={0}
                        max={100}
                        formatOptions={{
                            style: "percent",
                        }}
                        value={value}
                        onValueChange={(e) => handleOpacity(e.valueAsNumber)}
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>
                                    <LuArrowRightLeft />
                                </NumberInput.Scrubber>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                    </NumberInput.Root>
                    <Slider.Root
                        size={"sm"}
                        w={"100%"}
                        value={[value]}
                        onValueChange={(e) => handleOpacity(e.value[0])}
                    >
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Range />
                            </Slider.Track>
                            <Slider.Thumbs />
                        </Slider.Control>
                    </Slider.Root>
                    <IconButton
                        size={"xs"}
                        variant={"outline"}
                        onClick={toggleOpacity}
                    >
                        {value === "0" ? <LuEyeClosed /> : <LuEye />}
                    </IconButton>
                </Group>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};

const CornerRadiusBlock = ({ node }) => {
    const fromNodeCornerRadius = () => {
        const cr = node.cornerRadius();
        if (Array.isArray(cr)) {
            const [tr = 0, tl = 0, br = 0, bl = 0] = cr;
            return [tl, tr, bl, br];
        }
        const v = typeof cr === "number" && Number.isFinite(cr) ? cr : 0;
        return [v, v, v, v];
    };

    const toNodeCornerRadius = ([tl, tr, bl, br]) => [tl, tr, bl, br];

    const [corners, setCorners] = useState(fromNodeCornerRadius());
    const [showMixed, setShowMixed] = useState(
        Array.isArray(node.cornerRadius())
    );

    const syncNode = (nextCorners) => {
        node.cornerRadius(toNodeCornerRadius(nextCorners));
    };

    const normalizeNumber = (input) => {
        const n = typeof input === "number" ? input : convertCommaToDot(input);
        if (!Number.isFinite(n) || n < 0) return 0;
        return n;
    };

    const handleUniformChange = (raw) => {
        const v = normalizeNumber(raw);
        const next = [v, v, v, v];
        setCorners(next);
        syncNode(next);
    };

    const handleMixedChange = (index, raw) => {
        const v = normalizeNumber(raw);
        setCorners((prev) => {
            const next = [...prev];
            next[index] = v;
            syncNode(next);
            return next;
        });
    };

    const toggleMixed = () => {
        setShowMixed((prev) => {
            const next = !prev;
            if (!next) {
                setCorners((prev) => {
                    const v = prev[0] ?? 0;
                    const collapsed = [v, v, v, v];
                    syncNode(collapsed);
                    return collapsed;
                });
            }
            return next;
        });
    };

    const uniformValue = corners[0] ?? 0;

    return (
        <Fieldset.Root>
            <Fieldset.Legend>Corner radius</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <NumberInput.Root
                        size={"xs"}
                        min={0}
                        max={100}
                        value={uniformValue}
                        onValueChange={(e) =>
                            handleUniformChange(e.valueAsNumber)
                        }
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>
                                    <LuMaximize />
                                </NumberInput.Scrubber>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                    </NumberInput.Root>
                    <Slider.Root
                        size={"sm"}
                        w={"100%"}
                        value={[uniformValue]}
                        onValueChange={(e) => handleUniformChange(e.value[0])}
                    >
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Range />
                            </Slider.Track>
                            <Slider.Thumbs />
                        </Slider.Control>
                    </Slider.Root>
                    <IconButton
                        size={"xs"}
                        variant={showMixed ? "solid" : "outline"}
                        onClick={toggleMixed}
                    >
                        <LuMaximize />
                    </IconButton>
                </Group>
                {showMixed && (
                    <SimpleGrid columns={2} gap={2}>
                        <NumberInput.Root
                            size={"xs"}
                            min={0}
                            max={100}
                            value={corners[0]}
                            onValueChange={(e) =>
                                handleMixedChange(0, e.valueAsNumber)
                            }
                        >
                            <NumberInput.Control />
                            <InputGroup
                                startElementProps={{
                                    pointerEvents: "auto",
                                }}
                                startElement={
                                    <NumberInput.Scrubber>
                                        <RxCornerTopLeft />
                                    </NumberInput.Scrubber>
                                }
                            >
                                <NumberInput.Input />
                            </InputGroup>
                        </NumberInput.Root>
                        <NumberInput.Root
                            size={"xs"}
                            min={0}
                            max={100}
                            value={corners[1]}
                            onValueChange={(e) =>
                                handleMixedChange(1, e.valueAsNumber)
                            }
                        >
                            <NumberInput.Control />
                            <InputGroup
                                startElementProps={{
                                    pointerEvents: "auto",
                                }}
                                startElement={
                                    <NumberInput.Scrubber>
                                        <RxCornerTopRight />
                                    </NumberInput.Scrubber>
                                }
                            >
                                <NumberInput.Input />
                            </InputGroup>
                        </NumberInput.Root>
                        <NumberInput.Root
                            size={"xs"}
                            min={0}
                            max={100}
                            value={corners[2]}
                            onValueChange={(e) =>
                                handleMixedChange(2, e.valueAsNumber)
                            }
                        >
                            <NumberInput.Control />
                            <InputGroup
                                startElementProps={{
                                    pointerEvents: "auto",
                                }}
                                startElement={
                                    <NumberInput.Scrubber>
                                        <RxCornerBottomLeft />
                                    </NumberInput.Scrubber>
                                }
                            >
                                <NumberInput.Input />
                            </InputGroup>
                        </NumberInput.Root>
                        <NumberInput.Root
                            size={"xs"}
                            min={0}
                            max={100}
                            value={corners[3]}
                            onValueChange={(e) =>
                                handleMixedChange(3, e.valueAsNumber)
                            }
                        >
                            <NumberInput.Control />
                            <InputGroup
                                startElementProps={{
                                    pointerEvents: "auto",
                                }}
                                startElement={
                                    <NumberInput.Scrubber>
                                        <RxCornerBottomRight />
                                    </NumberInput.Scrubber>
                                }
                            >
                                <NumberInput.Input />
                            </InputGroup>
                        </NumberInput.Root>
                    </SimpleGrid>
                )}
            </Fieldset.Content>
        </Fieldset.Root>
    );
};

function convertCommaToDot(num) {
    return parseFloat(num ?? "")
        .toString()
        .replace(",", ".");
}

const FillBlock = ({ node }) => {
    return (
        <VStack align={"start"} w={"100%"}>
            <Heading size={"md"}>Fill</Heading>
            <FillColorSolid node={node} />
        </VStack>
    );
};

const FillColorSolid = ({ node }) => {
    const fill = node.fill() ?? "#000000";
    const [color, setColor] = useState(parseColor(fill));

    const handleChangeColor = (color) => {
        node.fill(color);
    };
    return (
        <ColorPicker.Root
            size={"xs"}
            value={color}
            onValueChange={(e) => setColor(e.value)}
            onValueChangeEnd={(e) => handleChangeColor(e.value.toString("hex"))}
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

const StrokeBlock = ({ node }) => {
    return (
        <VStack align={"start"} w={"100%"}>
            <Heading size={"md"}>Stroke</Heading>
            <StrokeColorSolid node={node} />
            <StrokeWeightBlock node={node} />
        </VStack>
    );
};

const StrokeColorSolid = ({ node }) => {
    const fill = node.stroke() ?? "#000000";
    const [color, setColor] = useState(parseColor(fill));

    const handleChangeColor = (color) => {
        node.stroke(color);
    };
    return (
        <ColorPicker.Root
            size={"xs"}
            value={color}
            onValueChange={(e) => setColor(e.value)}
            onValueChangeEnd={(e) => handleChangeColor(e.value.toString("hex"))}
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

const StrokeWeightBlock = ({ node }) => {
    const strokeWidth = node.strokeWidth();
    const [weight, setWeight] = useState(strokeWidth);

    const handleWeight = (value) => {
        let val = value;
        if (Number.isNaN(value)) val = 0;
        node.strokeWidth(val);
        setWeight(val);
    };

    return (
        <Fieldset.Root>
            <Fieldset.Legend>Weight</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <NumberInput.Root
                        size={"xs"}
                        min={0}
                        max={100}
                        value={weight}
                        onValueChange={(e) => handleWeight(e.valueAsNumber)}
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>
                                    <MdLineWeight />
                                </NumberInput.Scrubber>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                    </NumberInput.Root>
                    <Slider.Root
                        size={"sm"}
                        w={"100%"}
                        value={[weight]}
                        onValueChange={(e) => handleWeight(e.value[0])}
                    >
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Range />
                            </Slider.Track>
                            <Slider.Thumbs />
                        </Slider.Control>
                    </Slider.Root>
                </Group>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};
