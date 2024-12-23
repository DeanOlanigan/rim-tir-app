import { Text, Em, Card, Heading, HStack, Group, CheckboxCard, Icon, IconButton, Box, CheckboxGroup } from "@chakra-ui/react";
import { InfoTip } from "../../components/ui/toggle-tip";
import { 
    LuArrowLeft,
    LuCircleAlert,
    LuInfo,
    LuTriangleAlert,
    LuCirclePlus,
    LuCircleMinus,
    LuCirclePlay,
    LuCirclePause,
    LuCopy,
    LuDownload,
    LuWrapText,
    LuEraser
} from "react-icons/lu";
import { useLogContext } from "../../providers/LogProvider/LogContext";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { toaster } from "../../components/ui/toaster";

function LogToolBox() {
    const { state, dispatch } = useLogContext();

    return (
        <Group attached shadow={"md"}>
            <IconButton size={"xs"} variant={"outline"}><LuDownload/></IconButton>
            <IconButton size={"xs"} variant={"outline"}><LuCopy/></IconButton>
            <IconButton size={"xs"} variant={"outline"} onClick={() => dispatch({ type: "SET_TEXT_SIZE", payload: state.logTextSize + 1 })}><LuCirclePlus/></IconButton>
            <IconButton size={"xs"} variant={"outline"} onClick={() => dispatch({ type: "SET_TEXT_SIZE", payload: state.logTextSize - 1 })}><LuCircleMinus/></IconButton>
            <CheckboxCard.Root
                variant={"surface"}
                checked={state.isLogTextWrapped}
                onCheckedChange={(e) => dispatch({ type: "TOGGLE_WRAP", payload: e.checked })}
            >
                <CheckboxCard.HiddenInput />
                <CheckboxCard.Control p={"0.45rem"}>
                    <Icon fontSize={"16px"}>
                        <LuWrapText/>
                    </Icon>
                </CheckboxCard.Control>
            </CheckboxCard.Root>
            <CheckboxCard.Root 
                variant={"surface"}
                checked={state.isPaused}
                onCheckedChange={(e) => dispatch({ type: "TOGGLE_PAUSE", payload: e.checked })}
            >
                <CheckboxCard.HiddenInput />
                <CheckboxCard.Control p={"0.45rem"}>
                    <Icon fontSize={"16px"}>
                        {
                            state.isPaused
                                ? <LuCirclePlay/>
                                : <LuCirclePause/>
                        }
                    </Icon>
                </CheckboxCard.Control>
            </CheckboxCard.Root>
            <IconButton size={"xs"} variant={"outline"} onClick={() => dispatch({ type: "CLEAR_LOGS" })}><LuEraser/></IconButton>
        </Group>
    );
}

function LogTypesFilterButtons() {
    const { dispatch } = useLogContext();

    return (
        <CheckboxGroup
            onValueChange={(activeFilters) => {
                const newFilterState = {
                    WARNING: activeFilters.includes("WARNING"),
                    ERROR: activeFilters.includes("ERROR"),
                    INFO: activeFilters.includes("INFO"),
                };
                dispatch({ type: "SET_FILTER", payload: newFilterState });
            }}
            defaultValue={["WARNING", "ERROR", "INFO"]}
        >
            <Group attached shadow={"md"}>
                <CheckboxCard.Root variant={"surface"} colorPalette={"yellow"} value={"WARNING"} key={"WARNING"}>
                    <CheckboxCard.HiddenInput />
                    <CheckboxCard.Control p={"0.45rem"}>
                        <Icon fontSize={"16px"}>
                            <LuTriangleAlert/>
                        </Icon>
                    </CheckboxCard.Control>
                </CheckboxCard.Root>
                <CheckboxCard.Root variant={"surface"} colorPalette={"red"} value={"ERROR"} key={"ERROR"}>
                    <CheckboxCard.HiddenInput />
                    <CheckboxCard.Control p={"0.45rem"}>
                        <Icon fontSize={"16px"}>
                            <LuCircleAlert/>
                        </Icon>
                    </CheckboxCard.Control>
                </CheckboxCard.Root>
                <CheckboxCard.Root variant={"surface"} colorPalette={"blue"} value={"INFO"} key={"INFO"}>
                    <CheckboxCard.HiddenInput />
                    <CheckboxCard.Control p={"0.45rem"}>
                        <Icon fontSize={"16px"}>
                            <LuInfo/>
                        </Icon>
                    </CheckboxCard.Control>
                </CheckboxCard.Root>
            </Group>
        </CheckboxGroup>
    );
}

function LogViewerHeader({ onBackBtnClick }) {
    const { logData } = useLogContext();
    
    return (
        <HStack align={"center"} justify={"space-between"} gap={"4"}>
            <IconButton 
                size={"xs"}
                onClick={onBackBtnClick}
                shadow={"md"}
            >
                <LuArrowLeft/>
            </IconButton>
            <HStack gap={"0"}>
                <Heading>{logData.name}</Heading>
                <InfoTip>
                    <Text>Дата создания: <Em>{logData.createdAt}</Em></Text>
                    <Text>Размер: <Em>{logData.size}</Em></Text>
                    <Text>Тип: <Em>{logData.type.toLowerCase()}</Em></Text>
                    <Text>Изначальное количество строк: <Em>{logData.rows}</Em></Text>
                </InfoTip>
            </HStack>
            <LogTypesFilterButtons/>
            <LogToolBox/>
        </HStack>
    );
}
LogViewerHeader.propTypes = {
    onBackBtnClick: PropTypes.func
};

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

    const extractLogPart = (element, index) => {
        const splitData = element.split("\t");
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
        return color[severity] ?? "gray.500";
    };

    // TODO Идея фильтровать колонки (убирать дату, тип лога и т.д.)
    const renderLogPart = logs
        .filter((log) => currentFilter[log.severity])
        .map((log) => (
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

function LogViewer({ onBackBtnClick }) {
    return (
        
        <Card.Root flex={"1"} display={"flex"} flexDirection={"column"} minH={"0"} shadow={"xl"}>
            <Card.Header>
                <LogViewerHeader onBackBtnClick={onBackBtnClick}/>
            </Card.Header>
            <Card.Body flex={"1"} display={"flex"} flexDirection={"column"} minH={"0"}>
                <LogViewerBody/>
            </Card.Body>
        </Card.Root>                       
        
    );
}
LogViewer.propTypes = {
    onBackBtnClick: PropTypes.func
};

export default LogViewer;
