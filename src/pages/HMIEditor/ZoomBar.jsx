import { Button, Group, IconButton, Menu, Portal } from "@chakra-ui/react";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";
import { useActionsStore } from "./store/actions-store";
import { DEFAULT_MAX_ZOOM, DEFAULT_MIN_ZOOM } from "./constants";
import { setZoom, zoomByPercent } from "./canvas/utils/zoomService";
import { getClampedWorkAreaAnchor } from "./canvas/utils/zoom";
import { useFitToFrame } from "./canvas/hooks/useFitToFrame";

export const ZoomBar = ({ canvasRef, nodesRef, width, height }) => {
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

    const fitToFrame = useFitToFrame(canvasRef, width, height, false, nodesRef);

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
            <Menu.Root size={"sm"} unmountOnExit lazyMount>
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
                            {[1000, 250, 100, 50, 25].map((scale) => (
                                <Menu.Item
                                    key={scale}
                                    value={scale.toString()}
                                    onClick={() => handleScale(scale / 100)}
                                >
                                    {scale}%
                                </Menu.Item>
                            ))}
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
