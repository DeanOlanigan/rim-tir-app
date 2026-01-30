import { Box, Flex, HStack } from "@chakra-ui/react";
import { useThrottledResizeObserver } from "@/hooks/useThrottledResizeObserver";
import { ContextMenu } from "./ContextMenu";
import { ToolBar } from "./ToolBar";
import { HMICanvas } from "./canvas/HMICanvas";
import { useToolsManager } from "./canvas/hooks/useToolsManager";
import { useNodeStore } from "./store/node-store";
import { useMqttValues } from "./useMqttValues";
import { useEffect } from "react";
import { editGridDialog } from "./editGridDialog";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel/RightPanel";
import { confirmDialog } from "@/components/confirmDialog";

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
            <editGridDialog.Viewport />
            <confirmDialog.Viewport />
            <ContextMenu />
            <HMICanvas {...tools} width={width} height={height} />
            <Flex
                position={"absolute"}
                h={"100%"}
                top={0}
                left={0}
                pointerEvents={"none"}
                p={2}
                direction={"column"}
            >
                <LeftPanel tools={tools} width={width} height={height} />
            </Flex>
            <Box
                position={"absolute"}
                h={"100%"}
                top={0}
                right={0}
                p={2}
                pointerEvents={"none"}
            >
                <RightPanel api={tools.api} />
            </Box>
            <HStack position={"absolute"} bottom={2} alignSelf={"center"}>
                <ToolBar manager={tools.manager} />
            </HStack>
        </Flex>
    );
};
