import { Box, Flex, HStack } from "@chakra-ui/react";
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
import { useEffect } from "react";
import { confirmationDialog } from "./dialog";
import { Pages } from "./Pages/Pages";

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
            <Flex
                position={"absolute"}
                h={"100%"}
                top={0}
                left={0}
                p={2}
                direction={"column"}
                gap={2}
            >
                <EditorSettings tools={tools} width={width} height={height} />
                <Pages />
                <NodesTree api={tools.api} />
                <DebugInfo />
            </Flex>
            <Box position={"absolute"} h={"100%"} top={0} right={0} p={2}>
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
