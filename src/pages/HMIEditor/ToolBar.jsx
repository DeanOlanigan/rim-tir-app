import { Group, Icon, RadioCard } from "@chakra-ui/react";
import { useActionsStore } from "./store/actions-store";
import { ACTION_OPTIONS } from "./store/actions";

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
                {ACTION_OPTIONS.map((action) => (
                    <RadioCard.Item key={action.value} value={action.value}>
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
