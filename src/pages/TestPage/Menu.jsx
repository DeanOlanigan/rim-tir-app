import { Flex, IconButton, Separator } from "@chakra-ui/react";
import {
    LuCircle,
    LuHand,
    LuMousePointer2,
    LuMoveUpRight,
    LuSlash,
    LuSquare,
    LuType,
    LuZoomIn,
    LuZoomOut,
} from "react-icons/lu";

export const Menu = ({ minZoom, maxZoom, width, height, canvasRef }) => {
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
        <Flex
            bg={"colorPalette.contrast"}
            gap={"2"}
            py={"2"}
            px={"6"}
            borderRadius={"full"}
            border={"3px solid"}
            borderColor={"colorPalette.subtle"}
        >
            <IconButton variant={"ghost"} size={"md"}>
                <LuMousePointer2 />
            </IconButton>
            <IconButton variant={"ghost"} size={"md"}>
                <LuHand />
            </IconButton>
            <Separator orientation="vertical" />
            <IconButton variant={"ghost"} size={"md"}>
                <LuSquare />
            </IconButton>
            <IconButton variant={"ghost"} size={"md"}>
                <LuCircle />
            </IconButton>
            <Separator orientation="vertical" />
            <IconButton variant={"ghost"} size={"md"}>
                <LuType />
            </IconButton>
            <Separator orientation="vertical" />
            <IconButton variant={"ghost"} size={"md"}>
                <LuMoveUpRight />
            </IconButton>
            <IconButton variant={"ghost"} size={"md"}>
                <LuSlash />
            </IconButton>
            <Separator orientation="vertical" />
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
        </Flex>
    );
};
