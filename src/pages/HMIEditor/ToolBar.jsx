import { Group, Icon, RadioCard } from "@chakra-ui/react";
import { useActionsStore } from "./store/actions-store";
import { ACTIONS, HOTKEYS } from "./constants";
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
        label: "Select",
        icon: LuMousePointer2,
        hotkey: HOTKEYS.selectTool.hotkey,
    },
    {
        name: ACTIONS.hand,
        label: "Hand",
        icon: LuHand,
        hotkey: HOTKEYS.handTool.hotkey,
    },
    {
        name: ACTIONS.square,
        label: "Draw Rectangle",
        icon: LuSquare,
        hotkey: HOTKEYS.squareTool.hotkey,
    },
    {
        name: ACTIONS.polygon,
        label: "Draw Polygon",
        icon: LuHexagon,
    },
    {
        name: ACTIONS.ellipse,
        label: "Draw ellipse",
        icon: LuCircle,
    },
    {
        name: ACTIONS.text,
        label: "Text",
        icon: LuType,
        hotkey: HOTKEYS.textTool.hotkey,
    },
    {
        name: ACTIONS.line,
        label: "Draw line",
        icon: LuSlash,
        hotkey: HOTKEYS.lineTool.hotkey,
    },
    {
        name: ACTIONS.arrow,
        label: "Draw arrow",
        icon: LuMoveUpRight,
        hotkey: HOTKEYS.arrowTool.hotkey,
    },
];

export const ToolBar = ({ manager }) => {
    const action = useActionsStore((state) => state.currentAction);
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);

    if (viewOnlyMode) return null;

    return (
        <RadioCard.Root
            size={"md"}
            variant={"subtle"}
            borderRadius={"l2"}
            shadow={"md"}
            value={action}
            onValueChange={(e) => manager.setActive(e.value)}
        >
            <Group attached>
                {TOOLS_LIST.map((action) => (
                    <RadioCard.Item key={action.name} value={action.name}>
                        <RadioCard.ItemHiddenInput />
                        <RadioCard.ItemControl>
                            <Icon size={"sm"} as={action.icon} />
                        </RadioCard.ItemControl>
                    </RadioCard.Item>
                ))}
            </Group>
        </RadioCard.Root>
    );
};
