import { useEffect, useMemo } from "react";
import { useLogContext } from "../../providers/LogProvider/LogContext";
import { toaster } from "../../components/ui/toaster"; // Chakra UI toaster
import { Text, Box } from "@chakra-ui/react";

function LogViewerBody() {
    const { logData, setIsLogLoaded, state, dispatch } = useLogContext();
    const { isLogTextWrapped, logTextSize, currentFilter, logs } = state;
    //const [logContent, setLogContent] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            let type = "";
            switch (logData.type) {
            case "Логи во внутренней памяти роутера":
                type = "r";
                break;
            case "Логи на SD карте роутера":
                type = "sd";
                break;
            default:
                break;
            }

            try {
                const response = await fetch(`/api/v1/getLog?logfile=${logData.name}&limit=${logData.rows}&type=${type}`);
                if (!response.ok) {
                    throw new Error(`Ошибка получения логов: ${response.statusText}`);
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
            } finally {
                setIsLogLoaded(true);
            }
        };

        fetchLogs();

        return () => {
            setIsLogLoaded(false);
        };

    }, []);

    const appendLogs = (data) => {
        const logDataArr = data.split("\n").filter((line) => line);
        const newLogs = logDataArr.map((element, index) => extractLogPart(element, index));

        //setLogContent((prevLogs) => [...prevLogs, ...newLogs]);
        dispatch({ type: "ADD_LOGS", payload: newLogs });
    };

    const extractLogPart = (line, index) => {
        const splitData = line.split("\t");
        return ({
            id: 1 + index,
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
        () => logs.filter((log) => currentFilter[log.severity]),
        [logs, currentFilter]
    );

    // TODO Идея фильтровать колонки (убирать дату, тип лога и т.д.)
    const renderLogPart = filteredLogs.map((log) => (
        <Text
            key={log.id}
            whiteSpace={isLogTextWrapped ? "pre-wrap" : "pre"}
            fontFamily={"monospace"}
            fontSize={logTextSize}
            color={getColor(log.severity)}
        >
            {`${log.id.toString().padEnd(4)}\t[${log.dateTime}]\t[${log.severity}]\t{${log.message}}`}
        </Text>
    ));
    
    return (
        <Box flex={"1"} minH={"0"} overflow="auto">
            {renderLogPart}
        </Box>
    );
}

export default LogViewerBody;
