import { useCallback, useEffect, useMemo, useRef } from "react";
import { Text, Box, Badge, Flex } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster"; // Chakra UI toaster
import websocketService from "@/services/websocketService";
import { useLogStore } from "../LogStore/LogStore";
import useLogViewerStore from "../LogStore/LogViewerStore";
import { AutoSizer } from "react-virtualized";
import { FixedSizeList as List } from "react-window";
import { useAuth } from "@/hooks/useAuth";

const wsService = new websocketService("ws://192.168.1.1:8800");
//const ROW_HEIGHT = 40;

function LogViewerBody() {
    console.log("Render LogViewerBody");

    const { refreshMutation } = useAuth();
    const isPaused = useLogViewerStore(state => state.isPaused);
    const isLogTextWrapped = useLogViewerStore(state => state.isLogTextWrapped);
    const logTextSize = useLogViewerStore(state => state.logTextSize);
    const currentFilter = useLogViewerStore(state => state.currentFilter);
    const logs = useLogViewerStore(state => state.logs);
    const setLogs = useLogViewerStore(state => state.setLogsZus);
    const logData = useLogStore(state => state.logDataZus);

    const logsContainerRef = useRef(null);
    let logIndex = 1;

    const listRef = useRef();

    useEffect(() => {
        if (!isPaused) {
            scrollToBottom("smooth");
        }
    }, [logs, isPaused]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                await refreshMutation.mutateAsync();
                if (!refreshMutation.isError) {
                    const response = await fetch(
                        `/api/v1/getLog?logfile=${logData.logNameZus}&limit=${logData.logRowsZus}&type=${logData.logTypeZus}`
                    );
                    if (!response.ok) {
                        throw new Error(
                            `Ошибка получения логов: ${response.statusText}`
                        );
                    }
                    const result = await response.json();
                    if (result.code === 200) {
                        appendLogs(result.data);
                    } else {
                        throw new Error(result.message || "Неизвестная ошибка");
                    }
                } else {
                    throw refreshMutation.error;
                }
            } catch (error) {
                toaster.create({
                    title: "Error",
                    description: error.message,
                    type: "error",
                });
            }
        };
        fetchLogs();
    }, [logData.logNameZus, logData.logRowsZus, logData.logTypeZus]);

    useEffect(() => {
        wsService.connect();

        const messageHandler = (message) => {
            //console.log(message);
            appendLogs(message);
        };

        wsService.addMessageHandler(messageHandler);

        wsService.sendMessage({
            log: { fileName: logData.logNameZus, type: logData.logTypeZus },
        });

        return () => {
            wsService.removeMessageHandler(messageHandler);
            wsService.close();
        };
    }, []);

    const appendLogs = (data) => {
        const logDataArr = data.split("\n").filter((line) => line);
        const newLogs = logDataArr.map((element) => extractLogPart(element));
        setLogs(newLogs);   
    };

    const extractLogPart = (line) => {
        const splitData = line.split("\t");
        return {
            id: logIndex++,
            dateTime: splitData[0]?.slice(1, -1),
            severity: splitData[1]?.slice(1, -1), // Убираем квадратные скобки
            message: splitData[2],
        };
    };

    const getColor = (severity) => {
        let color = {
            INFO: "blue.500",
            ERROR: "red.500",
            WARNING: "yellow.500",
        };
        return color[severity] || "gray.500";
    };

    const filteredLogs = useMemo(() => {
        return logs.filter(
            (log) => log.severity === "STATUS" || currentFilter[log.severity]
        );
    }, [logs, currentFilter]);

    const visibleLogs = ({ index, style }) => {
        const log = filteredLogs[index];

        if (log.severity === "STATUS") {
            return (
                <Flex style={style} justify="center" aligns="center">
                    <Badge  variant="surface"size={"md"} w={"100%"} mx={"2"}>
                        {log.message}
                    </Badge>
                </Flex>
            );
        }

        return (
            <Box style={style} px={2} py={1}>
                <Text 
                    whiteSpace={isLogTextWrapped ? "pre-wrap" : "pre"}
                    fontFamily="monospace"
                    frontSize={logTextSize}
                    color={getColor(log.severity)}
                >
                    {`[${log.dateTime}]\t${("[" + log.severity + "]")
                        .toString()
                        .padStart(9)}\t${log.message}`}
                </Text>
            </Box>
        );
    };

    const scrollToBottom = useCallback((behavior = "auto") => {
        if (listRef.current && logs.length > 0) {
            listRef.current.scrollToItem(logs.length - 1, behavior === "smooth" ? "smart" : "end");
        }
    }, [logs.length]);

    // TODO Идея фильтровать колонки (убирать дату, тип лога и т.д.)
    /*const renderLogPart = filteredLogs.map((log) => {
        if (log.severity === "STATUS") {
            return ( =>
                <Flex key={`pause-${logIndex++}`} justify={"center"}>
                    <Badge
                        colorPalette="green"
                        variant={"surface"}
                        size={"md"}
                        w={"100%"}
                        mx={"2"}
                    >
                        {log.message}
                    </Badge>
                </Flex>
            );
        }

        return (
            <Text
                key={log.id}
                whiteSpace={isLogTextWrapped ? "pre-wrap" : "pre"}
                fontFamily={"monospace"}
                fontSize={logTextSize}
                color={getColor(log.severity)}
            >
                {`[${log.dateTime}]\t${("[" + log.severity + "]")
                    .toString()
                    .padStart(9)}\t${log.message}`}
            </Text>
        );
    });*/

    const setSize = useMemo(() => {
        if (logTextSize > 14) {
            let size = 35 + 7 * (logTextSize - 14);
            return size;
        }
        return 40;
    }, [logTextSize]);

    return (
        <Box ref={logsContainerRef} flex={"1"} minH={"0"} overflow="hidden">
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        ref={listRef}
                        height={height}
                        width={width}
                        itemCount={filteredLogs.length}
                        itemSize={setSize}
                        overscanCount={15}
                        style={{fontSize: logTextSize, fontStretch: (logTextSize / 7)}}
                    >
                        {visibleLogs}
                    </List>
                )}
            </AutoSizer>
        </Box>
    );
}

export default LogViewerBody;