import {
    Box,
    Checkbox,
    createListCollection,
    Field,
    Flex,
    Menu,
    NumberInput,
    Portal,
    Select,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { HMICanvas } from "./canvas/Canvas";
import { SubHeader } from "@/components/Header/SubHeader";
import { useThrottledResizeObserver } from "@/hooks/useThrottledResizeObserver";
import { Menu as ToolBar } from "./Menu";

const viewportDimensions = createListCollection({
    items: [
        { label: "100x75", value: "100x75", width: 100, height: 75 },
        { label: "800x600", value: "800x600", width: 800, height: 600 },
        { label: "1024x768", value: "1024x768", width: 1024, height: 768 },
        { label: "1280x720", value: "1280x720", width: 1280, height: 720 },
        { label: "1920x1080", value: "1920x1080", width: 1920, height: 1080 },
        { label: "2560x1440", value: "2560x1440", width: 2560, height: 1440 },
        { label: "3840x2160", value: "3840x2160", width: 3840, height: 2160 },
        { label: "5120x2880", value: "5120x2880", width: 5120, height: 2880 },
    ],
});

const minZoom = 0.2;
const maxZoom = 70;

function TestPage() {
    const [gridSize, setGridSize] = useState(1);
    const [size, setSize] = useState({ width: 100, height: 75 });
    const [showGrid, setShowGrid] = useState(false);
    const [snap, setSnap] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [showMenu, setShowMenu] = useState(false);

    const { ref, width, height } = useThrottledResizeObserver(100);
    const canvasRef = useRef(null);

    return (
        <>
            <SubHeader>
                <Select.Root
                    size={"xs"}
                    maxW={"3xs"}
                    collection={viewportDimensions}
                    defaultValue={["800x600"]}
                    onValueChange={(e) =>
                        setSize({
                            width: e.items[0].width,
                            height: e.items[0].height,
                        })
                    }
                    lazyMount
                    unmountOnExit
                >
                    <Select.HiddenSelect />
                    <Select.Label>Размер рабочей области</Select.Label>
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {viewportDimensions.items.map((row) => (
                                    <Select.Item item={row} key={row.value}>
                                        {row.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
                <Field.Root maxW={"3xs"}>
                    <Field.Label>Размер сетки</Field.Label>
                    <NumberInput.Root
                        w={"100%"}
                        size={"xs"}
                        value={gridSize}
                        onValueChange={(e) =>
                            setGridSize(parseInt(e.value, 10))
                        }
                        min={1}
                    >
                        <NumberInput.Control />
                        <NumberInput.Input />
                    </NumberInput.Root>
                </Field.Root>
                <Checkbox.Root
                    checked={snap}
                    onCheckedChange={(e) => setSnap(!!e.checked)}
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>Snap to grid</Checkbox.Label>
                </Checkbox.Root>
                <Checkbox.Root
                    checked={showGrid}
                    onCheckedChange={(e) => setShowGrid(!!e.checked)}
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>Show grid</Checkbox.Label>
                </Checkbox.Root>
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
                    gridSize={gridSize}
                    minZoom={minZoom}
                    maxZoom={maxZoom}
                    snapToGrid={snap}
                    showGrid={showGrid}
                    setMenuPosition={setMenuPosition}
                    setShowMenu={setShowMenu}
                />
                <Menu.Root
                    open={showMenu}
                    anchorPoint={{ x: menuPosition.x, y: menuPosition.y }}
                    positioning={{
                        getAnchorRect: () =>
                            DOMRect.fromRect({
                                x: menuPosition.x,
                                y: menuPosition.y,
                                width: 1,
                                height: 1,
                            }),
                    }}
                    unmountOnExit
                    lazyMount
                    skipAnimationOnMount
                    size={"sm"}
                >
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content>
                                <Menu.Item value="new-txt">
                                    New Text File
                                </Menu.Item>
                                <Menu.Item value="new-file">
                                    New File...
                                </Menu.Item>
                                <Menu.Item value="new-win">
                                    New Window
                                </Menu.Item>
                                <Menu.Item value="open-file">
                                    Open File...
                                </Menu.Item>
                                <Menu.Item value="export">Export</Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
                <Flex
                    position={"absolute"}
                    w={"calc(100% - 5px)"}
                    h={"48px"}
                    bottom={4}
                    left={1}
                    align={"center"}
                    justify={"center"}
                >
                    <ToolBar
                        width={width}
                        height={height}
                        minZoom={minZoom}
                        maxZoom={maxZoom}
                        canvasRef={canvasRef}
                    />
                </Flex>
            </Box>
        </>
    );
}
export default TestPage;
