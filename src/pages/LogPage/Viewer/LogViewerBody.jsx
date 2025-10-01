import { useRef } from "react";
import { Box } from "@chakra-ui/react";

export const LogViewerBody = () => {
    const logsContainerRef = useRef(null);
    let logIndex = 1;

    /* useEffect(() => {
        if (!isPaused) {
            scrollToBottom();
        }
    }, [logs, isPaused]); */

    /* useEffect(() => {
        if (isLoading) {
            return;
        }
        const fetchLogs = async () => {
            try {
                const response = await fetch(
                    `/api/v1/getLog?logfile=${logData.name}&limit=${logData.rows}&type=${logData.type}`
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
            } catch (error) {
                toaster.create({
                    title: "Error",
                    description: error.message,
                    type: "error",
                });
            }
        };

        fetchLogs();
    }, [isLoading, logData.name, logData.rows, logData.type]); */

    /* useEffect(() => {
        wsService.connect();

        const messageHandler = (message) => {
            //console.log(message);
            appendLogs(message);
        };

        wsService.addMessageHandler(messageHandler);

        wsService.sendMessage({
            log: { fileName: logData.name, type: logData.type },
        });

        return () => {
            wsService.removeMessageHandler(messageHandler);
            wsService.close();
        };
    }, []); */

    const appendLogs = (data) => {
        const logDataArr = data.split("\n").filter((line) => line);
        const newLogs = logDataArr.map((element) => extractLogPart(element));
        //setLogs(newLogs);
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

    /* const filteredLogs = useMemo(() => {
        return logs.filter(
            (log) => log.severity === "STATUS" || currentFilter[log.severity]
        );
    }, [logs, currentFilter]); */

    const scrollToBottom = () => {
        if (logsContainerRef.current) {
            logsContainerRef.current.scrollTop =
                logsContainerRef.current.scrollHeight;
        }
    };

    // TODO Идея фильтровать колонки (убирать дату, тип лога и т.д.)
    /* const renderLogPart = filteredLogs.map((log) => {
        if (log.severity === "STATUS") {
            return (
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
    }); */

    return (
        <Box ref={logsContainerRef} flex={"1"} minH={"0"} overflow="auto">
            {null}
            {/* {renderLogPart} */}
        </Box>
    );
};
