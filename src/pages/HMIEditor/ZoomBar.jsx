import { Button, Group, IconButton, Menu, Portal } from "@chakra-ui/react";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";
import { useActionsStore } from "./store/actions-store";
import { DEFAULT_MAX_ZOOM, DEFAULT_MIN_ZOOM } from "./constants";

export const ZoomBar = ({ width, height, canvasRef }) => {
    const scale = useActionsStore((state) => state.scale);
    const setScale = useActionsStore.getState().setScale;

    const handleZoom = (dir) => {
        const stage = canvasRef.current;
        if (!stage) return;
        const oldScale = stage.scaleX();
        const nextScale = Math.min(
            Math.max(oldScale * (1 + 0.2 * dir), DEFAULT_MIN_ZOOM),
            DEFAULT_MAX_ZOOM
        );
        const pointer = { x: width / 2, y: height / 2 };
        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };
        setScale(nextScale);
        stage.scale({ x: nextScale, y: nextScale });
        const newPos = {
            x: pointer.x - mousePointTo.x * nextScale,
            y: pointer.y - mousePointTo.y * nextScale,
        };
        stage.position(newPos);
    };

    const handleScale = (scale) => {
        setScale(scale);
        // TODO do better
        canvasRef.current.scale({ x: scale, y: scale });
        canvasRef.current.position({ x: width / 3, y: height / 4 });
    };

    return (
        <Group attached shadow={"md"}>
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
                    <Button size={"xs"} variant={"subtle"} w={"7ch"}>
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
                                75%
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
                            <Menu.Item
                                value="reset"
                                onClick={() => handleScale(1)}
                            >
                                Сброс
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
