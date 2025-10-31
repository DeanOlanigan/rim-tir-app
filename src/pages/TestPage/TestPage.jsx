import { Box, Field, Flex, IconButton, NumberInput } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { HMICanvas } from "./canvas/Canvas";
import { SubHeader } from "@/components/Header/SubHeader";
import { useThrottledResizeObserver } from "@/hooks/useThrottledResizeObserver";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";

function TestPage() {
    const [size, setSize] = useState({ width: 800, height: 600, gridSize: 10 });
    const { ref, width, height } = useThrottledResizeObserver(100);
    const canvasRef = useRef(null);

    const minZoom = 0.2;
    const maxZoom = 10;

    const handleZoomIn = () => {
        const stage = canvasRef.current;
        const oldScale = stage.scaleX();
        const direction = 1;
        const zoom = 1 + direction * 0.4;
        const newScale = Math.min(Math.max(oldScale * zoom, minZoom), maxZoom);

        stage.scale({ x: newScale, y: newScale });

        stage.batchDraw();
    };

    const handleZoomOut = () => {
        const stage = canvasRef.current;
        const oldScale = stage.scaleX();
        const direction = -1;
        const zoom = 1 + direction * 0.4;
        const newScale = Math.min(Math.max(oldScale * zoom, minZoom), maxZoom);

        stage.scale({ x: newScale, y: newScale });
        stage.batchDraw();
    };

    return (
        <>
            <SubHeader>
                <Field.Root orientation={"horizontal"}>
                    <Field.Label>Высота</Field.Label>
                    <NumberInput.Root
                        size={"xs"}
                        value={size.height}
                        onValueChange={(e) =>
                            setSize((prev) => ({
                                ...prev,
                                height: parseInt(e.value, 10) || e.value,
                            }))
                        }
                    >
                        <NumberInput.Control />
                        <NumberInput.Input />
                    </NumberInput.Root>
                </Field.Root>
                <Field.Root orientation={"horizontal"}>
                    <Field.Label>Ширина</Field.Label>
                    <NumberInput.Root
                        size={"xs"}
                        value={size.width}
                        onValueChange={(e) =>
                            setSize((prev) => ({
                                ...prev,
                                width: parseInt(e.value, 10) || e.value,
                            }))
                        }
                    >
                        <NumberInput.Control />
                        <NumberInput.Input />
                    </NumberInput.Root>
                </Field.Root>
                <Field.Root orientation={"horizontal"}>
                    <Field.Label>Размер сетки</Field.Label>
                    <NumberInput.Root
                        size={"xs"}
                        value={size.gridSize}
                        onValueChange={(e) =>
                            setSize((prev) => ({
                                ...prev,
                                gridSize: parseInt(e.value, 10) || e.value,
                            }))
                        }
                    >
                        <NumberInput.Control />
                        <NumberInput.Input />
                    </NumberInput.Root>
                </Field.Root>
            </SubHeader>
            <Box
                ref={ref}
                bg={"bg.emphasized"}
                h={"100%"}
                w={"100%"}
                position={"relative"}
            >
                <HMICanvas
                    canvasRef={canvasRef}
                    width={width}
                    height={height}
                    cHeight={size.height}
                    cWidth={size.width}
                    gridSize={size.gridSize}
                    minZoom={minZoom}
                    maxZoom={maxZoom}
                />
                <Flex
                    position={"absolute"}
                    w={"calc(100% - 5px)"}
                    h={"48px"}
                    bottom={1}
                    left={1}
                    gap={"2"}
                    align={"center"}
                    justify={"center"}
                >
                    <IconButton size={"xs"} onClick={handleZoomIn}>
                        <LuZoomIn />
                    </IconButton>
                    <IconButton size={"xs"} onClick={handleZoomOut}>
                        <LuZoomOut />
                    </IconButton>
                </Flex>
            </Box>
        </>
    );
}
export default TestPage;
