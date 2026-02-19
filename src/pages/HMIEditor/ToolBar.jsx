import { Button, HStack, Icon, Kbd, Text } from "@chakra-ui/react";
import { useActionsStore } from "./store/actions-store";
import { ACTIONS, HOTKEYS } from "./constants";
import { Tooltip } from "@/components/ui/tooltip";
import {
    LuCircle,
    LuHand,
    LuHexagon,
    LuMousePointer2,
    LuMoveUpRight,
    LuSlash,
    LuSquare,
    LuType,
} from "react-icons/lu";

const TOOLS_LIST = [
    {
        name: ACTIONS.select,
        label: "Выбор",
        icon: LuMousePointer2,
        keyLabel: HOTKEYS.selectTool.keyLabel,
    },
    {
        name: ACTIONS.hand,
        label: "Рука",
        icon: LuHand,
        keyLabel: HOTKEYS.handTool.keyLabel,
    },
    {
        name: ACTIONS.square,
        label: "Прямоугольник",
        icon: LuSquare,
        keyLabel: HOTKEYS.squareTool.keyLabel,
    },
    {
        name: ACTIONS.polygon,
        label: "Полигон",
        icon: LuHexagon,
        keyLabel: HOTKEYS.polygonTool.keyLabel,
    },
    {
        name: ACTIONS.ellipse,
        label: "Эллипс",
        icon: LuCircle,
        keyLabel: HOTKEYS.ellipseTool.keyLabel,
    },
    {
        name: ACTIONS.text,
        label: "Текст",
        icon: LuType,
        keyLabel: HOTKEYS.textTool.keyLabel,
    },
    {
        name: ACTIONS.line,
        label: "Линия",
        icon: LuSlash,
        keyLabel: HOTKEYS.lineTool.keyLabel,
    },
    {
        name: ACTIONS.arrow,
        label: "Стрелка",
        icon: LuMoveUpRight,
        keyLabel: HOTKEYS.arrowTool.keyLabel,
    },
];

export const ToolBar = ({ manager }) => {
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);

    if (viewOnlyMode) return null;

    return (
        <HStack
            gap={1}
            p={2}
            bg={"bg.subtle"}
            borderRadius={"xl"}
            shadow={"md"}
        >
            {TOOLS_LIST.map((tool) => (
                <ToolButton key={tool.name} tool={tool} manager={manager} />
            ))}
        </HStack>
    );
};

const ToolButton = ({ tool, manager }) => {
    const action = useActionsStore((state) => state.currentAction);
    const isActive = action === tool.name;
    return (
        <Tooltip
            showArrow
            openDelay={1000}
            content={
                <Text>
                    {tool.label} <Kbd variant={"plain"}>{tool.keyLabel}</Kbd>
                </Text>
            }
        >
            <Button
                aria-label={tool.label}
                variant={isActive ? "subtle" : "ghost"}
                size={"md"}
                onClick={() => manager.setActive(tool.name)}
            >
                <Icon size={"md"} as={tool.icon} />
            </Button>
        </Tooltip>
    );
};
