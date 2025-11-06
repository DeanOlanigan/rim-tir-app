import { Card, Flex, IconButton, Separator } from "@chakra-ui/react";
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
import { useActionsStore } from "./store/actions";

export const ToolBar = ({ minZoom, maxZoom, width, height, canvasRef }) => {
    const action = useActionsStore((state) => state.currentAction);
    const setAction = useActionsStore((state) => state.setCurrentAction);

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

    // TODO Заменить на radiocard
    return (
        <Flex
            position={"fixed"}
            left={0}
            right={0}
            bottom={10}
            zIndex={"popover"}
            justify={"center"}
        >
            <Card.Root
                //gap={"2"}
                //py={"1"}
                //px={"1"}
                //borderRadius={"xl"}
                border={"3px solid"}
                borderColor={"colorPalette.subtle"}
                size={"xs"}
                p={"1"}
                shadow={"md"}
            >
                <Card.Body flexDirection={"row"} gap={"1"}>
                    <IconButton
                        variant={action === "select" ? "solid" : "ghost"}
                        size={"md"}
                        onClick={() => setAction("select")}
                    >
                        <LuMousePointer2 />
                    </IconButton>
                    <IconButton
                        variant={action === "hand" ? "solid" : "ghost"}
                        size={"md"}
                        onClick={() => setAction("hand")}
                    >
                        <LuHand />
                    </IconButton>
                    <Separator orientation="vertical" />
                    <IconButton
                        variant={action === "square" ? "solid" : "ghost"}
                        size={"md"}
                        onClick={() => setAction("square")}
                    >
                        <LuSquare />
                    </IconButton>
                    <IconButton
                        variant={action === "circle" ? "solid" : "ghost"}
                        size={"md"}
                        onClick={() => setAction("circle")}
                    >
                        <LuCircle />
                    </IconButton>
                    <Separator orientation="vertical" />
                    <IconButton
                        variant={action === "text" ? "solid" : "ghost"}
                        size={"md"}
                        onClick={() => setAction("text")}
                    >
                        <LuType />
                    </IconButton>
                    <Separator orientation="vertical" />
                    <IconButton
                        variant={action === "arrow" ? "solid" : "ghost"}
                        size={"md"}
                        onClick={() => setAction("arrow")}
                    >
                        <LuMoveUpRight />
                    </IconButton>
                    <IconButton
                        variant={action === "line" ? "solid" : "ghost"}
                        size={"md"}
                        onClick={() => setAction("line")}
                    >
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
                </Card.Body>
            </Card.Root>
        </Flex>
    );
};
