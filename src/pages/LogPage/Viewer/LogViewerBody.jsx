import { useEffect, useMemo, useRef } from "react";
import { Text, Box, Badge, Flex } from "@chakra-ui/react";
import { toaster } from "../../../components/ui/toaster"; // Chakra UI toaster

import { useLogContext } from "../../../providers/LogProvider/LogContext";
import { useLogViewerContext } from "../../../providers/LogViewerProvider/LogViewerContext";

import websocketService from "../../../services/websocketService";
const wsService = new websocketService("ws://192.168.1.1:8800");

function LogViewerBody() {
    const { logData } = useLogContext();
    const {
        isPaused,
        isLogTextWrapped,
        logTextSize,
        currentFilter,
        logs,
        setLogs,
        pausedLogs,
        setPausedLogs
    } = useLogViewerContext();
    const isPausedRef = useRef();
    
    const logsContainerRef = useRef(null);
    let logIndex = 0;

    useEffect(() => {
        if (!isPaused) {
            scrollToBottom();
        }
    }, [logs, isPaused]);

    useEffect(() => {
        const fetchLogs = async () => {
            
            try {
                const response = await fetch(`/api/v1/getLog?logfile=${logData.name}&limit=${logData.rows}&type=${logData.type}`);
                if (!response.ok) {
                    throw new Error(`Ошибка получения логов: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.code === 200) {
                    appendLogs("ADD_LOGS", result.data);
                } else {
                    throw new Error(result.message || "Неизвестная ошибка");
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

    }, []);

    useEffect(() => {
        wsService.connect();

        const messageHandler = (message) => {
            //console.log(message);
            handleNewLog(message);
        };

        wsService.addMessageHandler(messageHandler);
        
        wsService.sendMessage({ log: {fileName: logData.name, type: logData.type} });

        return () => {
            wsService.removeMessageHandler(messageHandler);
            wsService.close();
        };
    }, []);

    const handleNewLog = (log) => {
        if (isPausedRef.current) {
            appendLogs("ADD_PAUSED_LOGS", log);
        } else {
            appendLogs("ADD_LOGS", log);
            setPausedLogs([]);
        }
    };

    const appendLogs = (type, data) => {
        const logDataArr = data.split("\n").filter((line) => line);
        const newLogs = logDataArr.map((element) => extractLogPart(element));

        //setLogContent((prevLogs) => [...prevLogs, ...newLogs]);
        
        switch (type) {
        case "ADD_LOGS":
            setLogs(newLogs);
            break;
        case "ADD_PAUSED_LOGS":
            setPausedLogs(newLogs);
            break;
        }
    };

    const extractLogPart = (line) => {
        const splitData = line.split("\t");
        return ({
            id: logIndex++,
            dateTime: splitData[0]?.slice(1, -1),
            severity: splitData[1]?.slice(1, -1), // Убираем квадратные скобки
            message: splitData[2],
        });
    };

    const getColor = (severity) => {
        let color = {
            INFO: "blue.500",
            ERROR: "red.500",
            WARNING: "yellow.500",
        };
        return color[severity] || "gray.500";
    };

    const filteredLogs = useMemo(
        () => {
            return logs.filter((log) => log.severity === "STATUS" || currentFilter[log.severity]);
        },
        [logs, currentFilter]
    );

    const scrollToBottom = () => {
        if (logsContainerRef.current) {
            logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
        }
    };

    // TODO Идея фильтровать колонки (убирать дату, тип лога и т.д.)
    const renderLogPart = filteredLogs.map((log) => {
        if (log.severity === "STATUS") {
            return (
                <Flex key={`pause-${logIndex++}`} justify={"center"}>
                    <Badge
                        colorPalette="green"
                        textAlign={"center"}
                        size={"md"}
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
                {
                    `${log.id}\t[${log.dateTime}]\t${("["+log.severity+"]").toString().padStart(9)}\t${log.message}`
                }
            </Text>
        );
    });

    return (
        <Box ref={logsContainerRef} flex={"1"} minH={"0"} overflow="auto">
            {renderLogPart}
        </Box>
    );
}

export default LogViewerBody;
