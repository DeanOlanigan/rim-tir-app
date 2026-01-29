import { Badge, Button, Flex, Heading } from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import { useActionsStore } from "../store/actions-store";
import { LuPanelRight } from "react-icons/lu";
import { EditorSettings } from "../EditorSettings";
import { BetterMenu } from "../EditorSettings/BetterMenu";

export const MinimizedPanel = ({ tools, width, height }) => {
    const activePage = useNodeStore((state) => state.pages[state.activePageId]);
    const projectName = useNodeStore((state) => state.projectName);

    return (
        <Flex
            maxW={"500px"}
            gap={2}
            bg={"bg"}
            p={3}
            borderRadius={"md"}
            shadow={"md"}
        >
            <BetterMenu tools={tools} width={width} height={height} />
            <EditorSettings tools={tools} width={width} height={height} />
            <Button
                flex={1}
                size={"xs"}
                variant={"ghost"}
                gap={4}
                onClick={() =>
                    useActionsStore
                        .getState()
                        .setIsUiExpanded(
                            !useActionsStore.getState().isUiExpanded,
                        )
                }
                justifyContent={"space-between"}
            >
                <Heading truncate size={"sm"}>
                    {projectName}
                </Heading>
                <Badge variant={"solid"}>{activePage.name}</Badge>
                <LuPanelRight />
            </Button>
        </Flex>
    );
};
