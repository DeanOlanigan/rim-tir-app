import { HStack, IconButton } from "@chakra-ui/react";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";

export const ZoomBar = ({ minZoom, maxZoom, width, height, canvasRef }) => {
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
        stage.scale({ x: nextScale, y: nextScale });
        const newPos = {
            x: pointer.x - mousePointTo.x * nextScale,
            y: pointer.y - mousePointTo.y * nextScale,
        };
        stage.position(newPos);
    };

    return (
        <HStack
            position={"absolute"}
            left={5}
            bottom={10}
            zIndex={"popover"}
            bg={"bg.subtle"}
            rounded={"md"}
            shadow={"md"}
        >
            <IconButton
                variant={"ghost"}
                size={"md"}
                onClick={() => handleZoom(1)}
            >
                <LuZoomIn />
            </IconButton>
            <IconButton
                variant={"ghost"}
                size={"md"}
                onClick={() => handleZoom(-1)}
            >
                <LuZoomOut />
            </IconButton>
        </HStack>
    );
};
