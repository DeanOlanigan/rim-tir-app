import { Flex, Group, Icon, RadioCard } from "@chakra-ui/react";
import { useActionsStore } from "./store/actions-store";
import { ACTION_OPTIONS } from "./store/actions";

export const ToolBar = () => {
    const action = useActionsStore((state) => state.currentAction);
    const setAction = useActionsStore((state) => state.setCurrentAction);

    return (
        <Flex
            position={"absolute"}
            bottom={10}
            alignSelf={"center"}
            zIndex={"popover"}
        >
            <RadioCard.Root
                size={"md"}
                variant={"subtle"}
                value={action}
                onValueChange={(e) => setAction(e.value)}
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
        </Flex>
    );
};
