import { Box } from "@chakra-ui/react";
import { useActionsStore } from "./store/actions-store";
import { ACTIONS } from "./store/actions";

const NODES_WITH_SETTINGS = [
    ACTIONS.square,
    ACTIONS.circle,
    ACTIONS.text,
    ACTIONS.arrow,
    ACTIONS.line,
];

export const NodeSettings = () => {
    const currentAction = useActionsStore((state) => state.currentAction);

    if (!NODES_WITH_SETTINGS.includes(currentAction)) return null;

    return (
        <Box
            bg={"bg"}
            w={"350px"}
            h={"100%"}
            p={2}
            borderRadius={"md"}
            shadow={"md"}
        >
            NodeSettings
        </Box>
    );
};
