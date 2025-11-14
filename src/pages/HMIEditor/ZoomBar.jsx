import { Button, Group, IconButton, Menu, Portal } from "@chakra-ui/react";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";
import { useActionsStore } from "./store/actions-store";
import { DEFAULT_MAX_ZOOM, DEFAULT_MIN_ZOOM } from "./constants";
import { setZoom, zoomByPercent } from "./canvas/utils/zoomService";
import { getClampedWorkAreaAnchor } from "./canvas/utils/zoom";
import { useFitToFrame } from "./canvas/hooks/useFitToFrame";

export const ZoomBar = ({ canvasRef, width, height }) => {
    const scale = useActionsStore((state) => state.scale);
    const size = useActionsStore((state) => state.size);

    const handleZoom = (dir) => {
        const stage = canvasRef.current;
        if (!stage) return;
        const anchor = getClampedWorkAreaAnchor(stage, size.width, size.height);
        zoomByPercent(stage, dir, anchor);
    };

    const handleScale = (scale) => {
        const stage = canvasRef.current;
        if (!stage) return;
        const anchor = getClampedWorkAreaAnchor(stage, size.width, size.height);
        setZoom(stage, scale, anchor);
    };

    const fitToFrame = useFitToFrame(
        canvasRef,
        size.width,
        size.height,
        width,
        height,
        false
    );

    return (
        <Group attached shadow={"md"} borderRadius={"l2"}>
            <IconButton
                variant={"subtle"}
                size={"xs"}
                disabled={scale === DEFAULT_MIN_ZOOM}
                onClick={() => handleZoom(-1)}
            >
                <LuZoomOut />
            </IconButton>
            <Menu.Root size={"sm"}>
                <Menu.Trigger asChild>
                    <Button
                        size={"xs"}
                        variant={"subtle"}
                        w={"7ch"}
                        rounded={"none"}
                    >
                        {Math.round(scale * 100)}%
                    </Button>
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content>
                            <Menu.Item
                                value="1000"
                                onClick={() => handleScale(10)}
                            >
                                1000%
                            </Menu.Item>
                            <Menu.Item
                                value="250"
                                onClick={() => handleScale(2.5)}
                            >
                                250%
                            </Menu.Item>
                            <Menu.Item
                                value="100"
                                onClick={() => handleScale(1)}
                            >
                                100%
                            </Menu.Item>
                            <Menu.Item
                                value="50"
                                onClick={() => handleScale(0.5)}
                            >
                                50%
                            </Menu.Item>
                            <Menu.Item
                                value="25"
                                onClick={() => handleScale(0.25)}
                            >
                                25%
                            </Menu.Item>
                            <Menu.Item value="reset" onClick={fitToFrame}>
                                Масштаб по рабочей области
                            </Menu.Item>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
            <IconButton
                variant={"subtle"}
                size={"xs"}
                disabled={scale === DEFAULT_MAX_ZOOM}
                onClick={() => handleZoom(1)}
            >
                <LuZoomIn />
            </IconButton>
        </Group>
    );
};
