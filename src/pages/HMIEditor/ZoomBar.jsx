import { Button, Group, IconButton } from "@chakra-ui/react";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";
import { useActionsStore } from "./store/actions-store";

export const ZoomBar = ({ minZoom, maxZoom, width, height, canvasRef }) => {
    const scale = useActionsStore((state) => state.scale);
    const setScale = useActionsStore.getState().setScale;

    const handleZoom = (dir) => {
        const stage = canvasRef.current;
        if (!stage) return;
        const oldScale = stage.scaleX();
        const nextScale = Math.min(
            Math.max(oldScale * (1 + 0.2 * dir), minZoom),
            maxZoom
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

    const resetZoom = () => {
        setScale(1);
        // TODO do better
        canvasRef.current.scale({ x: 1, y: 1 });
        canvasRef.current.position({ x: width / 3, y: height / 4 });
    };

    return (
        <Group attached shadow={"md"}>
            <IconButton
                variant={"subtle"}
                size={"xs"}
                onClick={() => handleZoom(-1)}
            >
                <LuZoomOut />
            </IconButton>
            <Button
                size={"xs"}
                variant={"subtle"}
                onClick={resetZoom}
                w={"6ch"}
            >
                {Math.round(scale * 100)}%
            </Button>
            <IconButton
                variant={"subtle"}
                size={"xs"}
                onClick={() => handleZoom(1)}
            >
                <LuZoomIn />
            </IconButton>
        </Group>
    );
};
