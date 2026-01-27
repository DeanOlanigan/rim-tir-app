import {
    Badge,
    Box,
    Button,
    Editable,
    Flex,
    Heading,
    HStack,
    IconButton,
    Tabs,
    VStack,
} from "@chakra-ui/react";
import { useThrottledResizeObserver } from "@/hooks/useThrottledResizeObserver";
import { ContextMenu } from "./ContextMenu";
import { ToolBar } from "./ToolBar";
import { ZoomBar } from "./ZoomBar";
import { HMICanvas } from "./canvas/HMICanvas";
import { UndoRedoButtons } from "./UndoRedoButtons";
import { EditorSettings } from "./EditorSettings";
import { DebugInfo } from "./DebugInfo";
import { useToolsManager } from "./canvas/hooks/useToolsManager";
import { NodesTree } from "./NodesTree";
import { NodeSettings } from "./NodeSettings";
import { useNodeStore } from "./store/node-store";
import { useMqttValues } from "./useMqttValues";
import { useEffect, useState } from "react";
import { confirmationDialog } from "./dialog";
import { Pages } from "./Pages/Pages";
import { useActionsStore } from "./store/actions-store";
import { LuPanelRight } from "react-icons/lu";

function HMIEditor() {
    return <HMIEditorContent />;
}
export default HMIEditor;

const HMIEditorContent = () => {
    const { ref, width, height } = useThrottledResizeObserver(100);
    const tools = useToolsManager();
    useMqttValues("monitoring/node/#", tools);

    useEffect(() => {
        useNodeStore.getState().setSelectedIds([]);
        useNodeStore.getState().rebuildVarIndex();
        return () => {
            useNodeStore.getState().setSelectedIds([]);
        };
    }, []);

    return (
        <Flex
            ref={ref}
            h={"100%"}
            position={"relative"}
            direction={"column"}
            overflow={"hidden"}
        >
            <confirmationDialog.Viewport />
            <ContextMenu />
            <HMICanvas {...tools} width={width} height={height} />
            <Box
                position={"absolute"}
                h={"100%"}
                top={0}
                left={0}
                pointerEvents={"none"}
            >
                <LeftPanel tools={tools} width={width} height={height} />
            </Box>
            <Box position={"absolute"} h={"100%"} top={0} right={0}>
                <NodeSettings api={tools.api} />
            </Box>
            <HStack position={"absolute"} bottom={2} alignSelf={"center"}>
                <ZoomBar
                    canvasRef={tools.canvasRef}
                    nodesRef={tools.nodesRef}
                    width={width}
                    height={height}
                />
                <ToolBar manager={tools.manager} />
                <UndoRedoButtons />
            </HStack>
        </Flex>
    );
};

const LeftPanel = ({ tools, width, height }) => {
    const isUiExpanded = useActionsStore((state) => state.isUiExpanded);
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);
    const debugMode = useActionsStore((state) => state.debugMode);

    const isMinimized = !isUiExpanded || viewOnlyMode;

    return (
        <Box h={isMinimized ? "auto" : "100%"} p={2} pointerEvents={"auto"}>
            {isMinimized ? (
                <MinimizedPanel
                    isUiExpanded={isUiExpanded}
                    tools={tools}
                    width={width}
                    height={height}
                />
            ) : (
                <VStack
                    bg={"bg"}
                    borderRadius={"md"}
                    shadow={"md"}
                    align={"stretch"}
                    w={"300px"}
                    h={"100%"}
                    p={2}
                >
                    <HStack justify={"space-between"}>
                        <EditorSettings
                            tools={tools}
                            width={width}
                            height={height}
                        />
                        <IconButton
                            size={"xs"}
                            variant={"ghost"}
                            onClick={() =>
                                useActionsStore
                                    .getState()
                                    .setIsUiExpanded(!isUiExpanded)
                            }
                        >
                            <LuPanelRight />
                        </IconButton>
                    </HStack>
                    <ProjectRename />

                    <Tabs.Root
                        variant={"line"}
                        defaultValue="file"
                        lazyMount
                        unmountOnExit
                        fitted
                        flex={1}
                        display={"flex"}
                        flexDirection={"column"}
                        minH={0}
                        size={"sm"}
                    >
                        <Tabs.List>
                            <Tabs.Trigger value="file">File</Tabs.Trigger>
                            <Tabs.Trigger value="assets" disabled>
                                Assets
                            </Tabs.Trigger>
                            {debugMode && (
                                <Tabs.Trigger value="debug">Debug</Tabs.Trigger>
                            )}
                        </Tabs.List>
                        <Tabs.Content
                            value="file"
                            flex={1}
                            display={"flex"}
                            flexDirection={"column"}
                            minH={0}
                        >
                            <Box flexShrink={0} maxH={"30%"}>
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
                                flex={1}
                                minH={0}
                            >
                                <DebugInfo />
                            </Tabs.Content>
                        )}
                    </Tabs.Root>
                </VStack>
            )}
        </Box>
    );
};

const ProjectRename = () => {
    const renameProject = useNodeStore((s) => s.renameProject);
    const projectName = useNodeStore((state) => state.projectName);

    const [name, setName] = useState(projectName);

    return (
        <Editable.Root
            size={"sm"}
            value={name}
            onValueChange={(e) => setName(e.value)}
            onValueCommit={(e) => {
                const next = e.value.trim();
                if (next) renameProject(next);
            }}
            submitMode="both"
            activationMode="dblclick"
            selectOnFocus
        >
            <Editable.Preview truncate fontSize={"md"} fontWeight={"medium"} />
            <Editable.Input fontSize={"md"} fontWeight={"medium"} />
        </Editable.Root>
    );
};

const MinimizedPanel = ({ isUiExpanded, tools, width, height }) => {
    const activePageId = useNodeStore((state) => state.activePageId);
    const activePage = useNodeStore((state) => state.pages[activePageId]);
    const projectName = useNodeStore((state) => state.projectName);

    return (
        <Flex
            w={"100%"}
            gap={2}
            bg={"bg"}
            p={3}
            borderRadius={"md"}
            shadow={"md"}
        >
            <EditorSettings tools={tools} width={width} height={height} />
            <Button
                flex={1}
                size={"xs"}
                variant={"ghost"}
                gap={2}
                onClick={() =>
                    useActionsStore.getState().setIsUiExpanded(!isUiExpanded)
                }
                justifyContent={"space-between"}
            >
                <HStack gap={4}>
                    <Heading truncate size={"sm"}>
                        {projectName}
                    </Heading>
                    <Badge variant={"solid"}>{activePage.name}</Badge>
                </HStack>
                <LuPanelRight />
            </Button>
        </Flex>
    );
};
