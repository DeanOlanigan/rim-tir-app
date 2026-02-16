import { Box, Flex, HStack, IconButton } from "@chakra-ui/react";
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
import { HELP_DIALOG_ID, helpDialog } from "./helpDialog";
import { FaQuestion } from "react-icons/fa6";

function HMIEditor() {
    return <HMIEditorContent />;
}
export default HMIEditor;

const HMIEditorContent = () => {
    console.log("RENDER EDITOR");
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
            <IconButton
                position={"absolute"}
                bottom={4}
                right={4}
                size={"sm"}
                p={2}
                variant={"subtle"}
                as={FaQuestion}
                rounded={"full"}
                onClick={() => helpDialog.open(HELP_DIALOG_ID)}
            />
            <HStack position={"absolute"} bottom={2} alignSelf={"center"}>
                <ToolBar manager={tools.manager} />
            </HStack>
        </Flex>
    );
};
