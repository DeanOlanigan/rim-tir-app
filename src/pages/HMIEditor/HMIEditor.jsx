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
            <Box position={"absolute"} h={"100%"} top={0} left={0}>
                <LeftPanel tools={tools} width={width} height={height} />
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
            <Box position={"absolute"} h={"100%"} top={0} right={0}>
                <NodeSettings api={tools.api} />
            </Box>
        </Flex>
    );
};

const LeftPanel = ({ tools, width, height }) => {
    const isUiExpanded = useActionsStore((state) => state.isUiExpanded);
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);

    return (
        <Box h={"100%"} p={2}>
            {!isUiExpanded && (
                <MinimazedPanel
                    isUiExpanded={isUiExpanded}
                    tools={tools}
                    width={width}
                    height={height}
                />
            )}
            {isUiExpanded && !viewOnlyMode && (
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
                        variant={"subtle"}
                        defaultValue="file"
                        lazyMount
                        unmountOnExit
                        fitted
                        w={"100%"}
                        h={"100%"}
                        display={"flex"}
                        flexDirection={"column"}
                        overflow={"hidden"}
                        size={"sm"}
                    >
                        <Tabs.List>
                            <Tabs.Trigger value="file">File</Tabs.Trigger>
                            <Tabs.Trigger value="assets">Assets</Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content
                            value="file"
                            display={"flex"}
                            flexDirection={"column"}
                            h={"100%"}
                            flex={1}
                            minH={0}
                        >
                            <Pages />
                            <NodesTree api={tools.api} />
                            <DebugInfo />
                        </Tabs.Content>
                        <Tabs.Content value="assets"></Tabs.Content>
                    </Tabs.Root>
                </VStack>
            )}
        </Box>
    );
};

const ProjectRename = () => {
    const activePageId = useNodeStore((state) => state.activePageId);
    const activePage = useNodeStore((state) => state.pages[activePageId]);

    const renameProject = useNodeStore((s) => s.renameProject);
    const projectName = useNodeStore((state) => state.projectName);

    const [name, setName] = useState(projectName);

    return (
        <HStack justify={"space-between"}>
            <Editable.Root
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
                <Editable.Preview
                    truncate
                    fontSize={"md"}
                    fontWeight={"medium"}
                />
                <Editable.Input fontSize={"md"} fontWeight={"medium"} />
            </Editable.Root>
            <Badge variant={"solid"}>{activePage.name}</Badge>
        </HStack>
    );
};

const MinimazedPanel = ({ isUiExpanded, tools, width, height }) => {
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
                <HStack>
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
