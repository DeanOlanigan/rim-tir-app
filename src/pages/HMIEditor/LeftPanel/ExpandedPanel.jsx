import {
    Box,
    HStack,
    Icon,
    IconButton,
    Kbd,
    Tabs,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useActionsStore } from "../store/actions-store";
import { LuPanelLeftClose } from "react-icons/lu";
import { ProjectRename } from "./ProjectRename";
import { Pages } from "../Pages/Pages";
import { NodesTree } from "../NodesTree";
import { EditorMenu } from "../EditorSettings";
import { DebugInfo } from "./DebugInfo";
import { ZoomUndoBlock } from "./ZoomUndoBlock";
import { ProjectStatusInformer } from "./ProjectStatusInformer";
import { HOTKEYS, LOCALE } from "../constants";
import { Tooltip } from "@/components/ui/tooltip";

export const ExpandedPanel = ({ tools }) => {
    const debugMode = useActionsStore((state) => state.debugMode);

    return (
        <VStack
            bg={"bg.panel"}
            borderRadius={"md"}
            shadow={"md"}
            align={"stretch"}
            w={"300px"}
            h={"100%"}
            minH={0}
            p={3}
        >
            <HStack justify={"space-between"}>
                <HStack>
                    <EditorMenu tools={tools} />
                    <ProjectStatusInformer />
                </HStack>
                <Tooltip
                    showArrow
                    content={
                        <Text>
                            Свернуть панель{" "}
                            <Kbd variant={"plain"} size={"sm"}>
                                {HOTKEYS.minimizeUi.keyLabel}
                            </Kbd>
                        </Text>
                    }
                >
                    <IconButton
                        size={"xs"}
                        variant={"ghost"}
                        onClick={() =>
                            useActionsStore
                                .getState()
                                .setIsUiExpanded(
                                    !useActionsStore.getState().isUiExpanded,
                                )
                        }
                    >
                        <Icon as={LuPanelLeftClose} boxSize="5" />
                    </IconButton>
                </Tooltip>
            </HStack>

            <ProjectRename />

            <Tabs.Root
                variant={"line"}
                defaultValue="file"
                lazyMount
                unmountOnExit
                fitted
                display={"flex"}
                flexDirection={"column"}
                h={"100%"}
                minH={0}
                size={"sm"}
            >
                <Tabs.List>
                    <Tabs.Trigger value="file">{LOCALE.file}</Tabs.Trigger>
                    <Tooltip showArrow content={"В разработке"}>
                        <Tabs.Trigger value="assets" disabled>
                            {LOCALE.assets}
                        </Tabs.Trigger>
                    </Tooltip>
                    {debugMode && (
                        <Tabs.Trigger value="debug">
                            {LOCALE.debug}
                        </Tabs.Trigger>
                    )}
                </Tabs.List>
                <Tabs.Content
                    value="file"
                    display={"flex"}
                    flexDirection={"column"}
                    h={"100%"}
                    minH={0}
                >
                    <Box flexShrink={0} h={"40%"}>
                        <Pages />
                    </Box>
                    <Box flex={1} minH={0} position={"relative"}>
                        <NodesTree api={tools.api} />
                    </Box>
                </Tabs.Content>
                <Tabs.Content value="assets"></Tabs.Content>
                {debugMode && (
                    <Tabs.Content
                        value="debug"
                        display={"flex"}
                        flexDirection={"column"}
                        h={"100%"}
                        minH={0}
                    >
                        <DebugInfo />
                    </Tabs.Content>
                )}
            </Tabs.Root>
            <ZoomUndoBlock tools={tools} />
        </VStack>
    );
};
