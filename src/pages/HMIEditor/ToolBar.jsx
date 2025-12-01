import { Group, Icon, RadioCard } from "@chakra-ui/react";
import { useActionsStore } from "./store/actions-store";
import { ACTIONS } from "./constants";
import {
    LuCircle,
    LuHand,
    LuHexagon,
    LuMousePointer2,
    LuMoveUpRight,
    LuSlash,
    LuSquare,
} from "react-icons/lu";

const TOOLS_LIST = [
    {
        name: ACTIONS.select,
        label: "Select",
        icon: LuMousePointer2,
    },
    {
        name: ACTIONS.hand,
        label: "Hand",
        icon: LuHand,
    },
    {
        name: ACTIONS.square,
        label: "Draw Rectangle",
        icon: LuSquare,
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
        name: ACTIONS.line,
        label: "Draw line",
        icon: LuSlash,
    },
    {
        name: ACTIONS.arrow,
        label: "Draw arrow",
        icon: LuMoveUpRight,
    },
];

export const ToolBar = ({ manager }) => {
    const action = useActionsStore((state) => state.currentAction);
    return (
        <RadioCard.Root
            size={"md"}
            variant={"subtle"}
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
