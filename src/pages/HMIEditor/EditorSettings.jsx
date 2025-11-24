import {
    Checkbox,
    createListCollection,
    Field,
    IconButton,
    NumberInput,
    Popover,
    Portal,
    Select,
    Stack,
} from "@chakra-ui/react";
import { LuMenu } from "react-icons/lu";
import { useActionsStore } from "./store/actions-store";
import { ColorComp } from "./ColorComp";

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

export const EditorSettings = () => {
    const gridSize = useActionsStore((state) => state.gridSize);
    const showGrid = useActionsStore((state) => state.showGrid);
    const snap = useActionsStore((state) => state.snap);
    const clampToArea = useActionsStore((state) => state.clampToArea);
    const debugMode = useActionsStore((state) => state.debugMode);
    const gridColor = useActionsStore((state) => state.gridColor);
    const backgroundColor = useActionsStore((state) => state.backgroundColor);
    const workAreaColor = useActionsStore((state) => state.workAreaColor);
    const showNodesTree = useActionsStore((state) => state.showNodesTree);

    const {
        setSize,
        setGridSize,
        setShowGrid,
        setSnap,
        setClampToArea,
        setDebugMode,
        setWorkAreaColor,
        setBackgroundColor,
        setGridColor,
        setShowNodesTree,
    } = useActionsStore.getState();

    return (
        <Popover.Root size={"xs"} lazyMount unmountOnExit>
            <Popover.Trigger asChild>
                <IconButton size={"xs"} variant={"subtle"} shadow={"md"}>
                    <LuMenu />
                </IconButton>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content>
                        <Popover.Body>
                            <Stack>
                                <Select.Root
                                    size={"xs"}
                                    maxW={"3xs"}
                                    collection={viewportDimensions}
                                    defaultValue={["100x75"]}
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
                                    <Select.Label>
                                        Размер рабочей области
                                    </Select.Label>
                                    <Select.Control>
                                        <Select.Trigger>
                                            <Select.ValueText />
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                            <Select.Indicator />
                                        </Select.IndicatorGroup>
                                    </Select.Control>

                                    <Select.Positioner>
                                        <Select.Content>
                                            {viewportDimensions.items.map(
                                                (row) => (
                                                    <Select.Item
                                                        item={row}
                                                        key={row.value}
                                                    >
                                                        {row.label}
                                                        <Select.ItemIndicator />
                                                    </Select.Item>
                                                )
                                            )}
                                        </Select.Content>
                                    </Select.Positioner>
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
                                    onCheckedChange={(e) =>
                                        setSnap(!!e.checked)
                                    }
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>
                                        Snap to grid
                                    </Checkbox.Label>
                                </Checkbox.Root>
                                <Checkbox.Root
                                    checked={showGrid}
                                    onCheckedChange={(e) =>
                                        setShowGrid(!!e.checked)
                                    }
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>Show grid</Checkbox.Label>
                                </Checkbox.Root>
                                <Checkbox.Root
                                    checked={clampToArea}
                                    onCheckedChange={(e) =>
                                        setClampToArea(!!e.checked)
                                    }
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>
                                        Clamp to work area
                                    </Checkbox.Label>
                                </Checkbox.Root>
                                <Checkbox.Root
                                    checked={showNodesTree}
                                    onCheckedChange={(e) =>
                                        setShowNodesTree(!!e.checked)
                                    }
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>
                                        Show nodes tree
                                    </Checkbox.Label>
                                </Checkbox.Root>
                                <Checkbox.Root
                                    checked={debugMode}
                                    onCheckedChange={(e) =>
                                        setDebugMode(!!e.checked)
                                    }
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>Debug mode</Checkbox.Label>
                                </Checkbox.Root>
                                <ColorComp
                                    label={"Background color"}
                                    outerColor={backgroundColor}
                                    setOuterColor={setBackgroundColor}
                                />
                                <ColorComp
                                    label={"Work area color"}
                                    outerColor={workAreaColor}
                                    setOuterColor={setWorkAreaColor}
                                />
                                <ColorComp
                                    label={"Grid color"}
                                    outerColor={gridColor}
                                    setOuterColor={setGridColor}
                                />
                            </Stack>
                        </Popover.Body>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
};
