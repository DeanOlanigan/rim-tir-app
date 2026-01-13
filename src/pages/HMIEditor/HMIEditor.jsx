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
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useMonitoringLive } from "../MonitoringPage/store/mqtt-stream-store";
import { useMqttLive } from "../MonitoringPage/useMqttLive";
import { Loader } from "@/components/Loader";
import { ErrorInformer } from "@/components/ErrorInformer";
import { getConfiguration, QK } from "@/api";

function HMIEditor() {
    const { data, isLoading, isFetching, isError, error } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
    });
    useEffect(() => {
        if (!data) return;
        useMonitoringLive.getState().clear();
    }, [data]);

    useMqttLive("monitoring/node/#");

    if (isLoading) return <Loader text={"Загрузка данных"} />;
    if (isError) return <ErrorInformer error={error} />;
    if (isFetching) return <Loader text={"Обновление данных"} />;

    return <HMIEditorContent />;
}
export default HMIEditor;

const HMIEditorContent = () => {
    const { ref, width, height } = useThrottledResizeObserver(100);
    const tools = useToolsManager();

    useNodeStore.getState().setSelectedIds([]);

    return (
        <Flex
            ref={ref}
            h={"100%"}
            position={"relative"}
            direction={"column"}
            overflow={"hidden"}
        >
            <ContextMenu />
            <HMICanvas {...tools} width={width} height={height} />
            <Box position={"absolute"} left={2} top={2}>
                <EditorSettings />
            </Box>
            <Box
                position={"absolute"}
                left={2}
                top={"25%"}
                transform={"translateY(-25%)"}
            >
                <NodesTree api={tools.api} />
            </Box>
            <Box position={"absolute"} bottom={12} left={2}>
                <DebugInfo />
            </Box>
            <Box position={"absolute"} h={"100%"} top={0} right={0} p={2}>
                <NodeSettings api={tools.api} />
            </Box>
            <HStack position={"absolute"} left={2} bottom={2}>
                <ZoomBar
                    canvasRef={tools.canvasRef}
                    nodesRef={tools.nodesRef}
                    width={width}
                    height={height}
                />
                <UndoRedoButtons />
            </HStack>
            <HStack position={"absolute"} bottom={2} alignSelf={"center"}>
                <ToolBar manager={tools.manager} />
            </HStack>
        </Flex>
    );
};
