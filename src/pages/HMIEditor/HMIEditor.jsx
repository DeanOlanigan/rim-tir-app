import { Box, Flex, Grid } from "@chakra-ui/react";
import { ContextMenu } from "./ContextMenu";
import { ToolBar } from "./ToolBar";
import { HMICanvas } from "./canvas/HMICanvas";
import { useToolsManager } from "./canvas/hooks/useToolsManager";
import { useMqttValues } from "./hooks/useMqttValues";
import { editGridDialog } from "./editGridDialog";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel/RightPanel";
import { confirmDialog } from "@/components/confirmDialog";
import { OPEN_PROJECT_DIALOG_ID, openProjectDialog } from "./ProjectManager";
import { useEditorHotkeys } from "./hooks/useEditorHotkeys";
import { useHMICanvasResize } from "./hooks/useHMICanvasResize";
import { useEffect } from "react";
import { useNodeStore } from "./store/node-store";
import { fitNodesToFrame } from "./utils";
import { helpDialog } from "./helpDialog";
import { HelpButton } from "./HelpButton";
import { KeepToolAfterDrawButton } from "./KeepToolAfterDrawButton";
import { FullScreenButton } from "./FullScreenButton";

function HMIEditor() {
    return <HMIEditorContent />;
}
export default HMIEditor;

const HMIEditorContent = () => {
    const { ref } = useHMICanvasResize();
    const tools = useToolsManager();
    useMqttValues("monitoring/node/#", tools);

    useEditorHotkeys(tools);

    useEffect(() => {
        const store = useNodeStore.getState();
        if (store.meta.mode === "new" && !store.meta.isDirty) {
            openProjectDialog.open(OPEN_PROJECT_DIALOG_ID, { tools });
        }
        setTimeout(() => {
            fitNodesToFrame(tools.canvasRef, tools.nodesRef);
        }, 100);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Flex
            ref={ref}
            h={"100%"}
            position={"relative"}
            direction={"column"}
            overflow={"hidden"}
        >
            <openProjectDialog.Viewport />
            <editGridDialog.Viewport />
            <confirmDialog.Viewport />
            <helpDialog.Viewport />
            <ContextMenu tools={tools} />
            <HMICanvas {...tools} />
            <Flex
                position={"absolute"}
                h={"100%"}
                top={0}
                left={0}
                pointerEvents={"none"}
                direction={"column"}
            >
                <LeftPanel tools={tools} />
            </Flex>
            <Box
                position={"absolute"}
                h={"100%"}
                top={0}
                right={0}
                pointerEvents={"none"}
            >
                <RightPanel api={tools.api} />
            </Box>
            <FullScreenButton />
            <HelpButton />
            <Box
                position={"absolute"}
                left={0}
                right={0}
                bottom={2}
                pointerEvents={"none"}
            >
                <Grid
                    templateColumns={"1fr auto 1fr"}
                    alignItems={"center"}
                    gap={4}
                >
                    <Box pointerEvents="auto" justifySelf="end">
                        <KeepToolAfterDrawButton />
                    </Box>
                    <ToolBar manager={tools.manager} />
                    <Box />
                </Grid>
            </Box>
        </Flex>
    );
};
