import { Flex, Container, Heading, Text, Card, Box, Stack, Group, AbsoluteCenter, Spinner } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "../../components/ui/select";
import { toaster } from "../../components/ui/toaster";
import { Tooltip } from "../../components/ui/tooltip";
import { Button } from "../../components/ui/button";
import { RadioCardItem, RadioCardRoot } from "../../components/ui/radio-card";
import { LuDownload, LuEye } from "react-icons/lu";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function LogPlaceTypeCard({ headingText, logList, loading, selectedLog, onSelectLog }) {
    const handleSelect = (log) => {
        onSelectLog(log);
    };

    const downloadAllLogFiles = () => {
        let type = "";
        switch (headingText) {
        case "Логи на SD карте роутера":
            type = "sd";
            break;
        case "Логи во внутренней памяти роутера":
        default:
            type = "r";
            break;
        }
        const fetchDownload = async () => {
            try {
                const response = await fetch(`/api/v1/getArchive?archive=logs&type=${type}`);
                if (!response.ok) {
                    throw new Error(`Ошибка: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.code === 202) {
                    localStorage.setItem("logTaskId", result.data.task_id);
                    checkStatus(result.data.task_id);
                    alert(`TASK STARTED ${result.message}`);
                } else {
                    throw new Error(result.message || "Неизвестная ошибка");
                }
            } catch (err) {
                throw new Error(`Ошибка: ${err.message}`);
            }
        };

        const checkStatus = async (taskId) => {
            try {
                const response = await fetch(`api/v1/getArchiveStatus?task_id=${taskId}`);
                if (!response.ok) {
                    localStorage.removeItem("logTaskId");
                    throw new Error(response.data.code);
                }
                const result = await response.json();
                if (response.ok && result.message == "Задача завершена") {
                    localStorage.removeItem("logTaskId");
                    let fileName = result.data.file;
                    let taskId = result.data.task_id;
                    window.location.href = `api/v1/getReadyArchive?file=${fileName}&task_id=${taskId}`;
                    alert(`Файл ${fileName}, Задача ${taskId}`);
                }
                if (response.ok && result.message == "Задача выполняется") {
                    console.log(result.data.status);
                    setTimeout(() =>checkStatus(taskId), 1000);
                }
            } catch (err) {
                alert(err);
            }
        };

        fetchDownload();
    };

    const formatFileSize = (size) => {
        if (size >= 1073741824) {
            return (size / 1073741824).toFixed(2) + " GB";
        } else if (size >= 1048576) {
            return (size / 1048576).toFixed(2) + " MB";
        } else if (size >= 1024) {
            return (size / 1024).toFixed(2) + " KB";
        } else {
            return size + " B";
        }
    };

    return (
        <Card.Root w={"100%"}>
            <Card.Header>
                <Card.Title>{headingText}</Card.Title>
            </Card.Header>
            <Card.Body position={"relative"}>
                <Box h={"30vh"} overflowY={"auto"} pe="0.5em">
                    {logList && logList.length > 0 ? (
                        <RadioCardRoot 
                            gap={"2"}
                            size={"md"}
                            variant="outline"
                            onValueChange={
                                (log) => handleSelect(log.value)
                            }
                            onDoubleClick={
                                (event) => {
                                    const target = event.target.closest("[data-value]");
                                    const value = target?.dataset.value;
                                    const description = target?.nextElementSibling?.textContent;
                                    console.log(value, description);
                                }
                            }
                            value={selectedLog.type === headingText ? selectedLog.name : null}>
                            <Group attached orientation={"vertical"}>
                                {logList.map((log, index) => (
                                    <RadioCardItem
                                        width={"full"}
                                        key={index}
                                        value={log.name}
                                        label={`${log.name}`}
                                        description={`${log.created_at} | ${formatFileSize(log.size)}`}
                                        indicatorPlacement="start"
                                    />
                                ))}
                            </Group>
                        </RadioCardRoot>
                    ) : (
                        loading ? <></> : <Text fontWeight={"medium"} textAlign={"center"} color="tomato">Не найдено</Text>
                    )}
                </Box>
                <AbsoluteCenter display={loading ? "" : "none"}>
                    <Spinner/>
                </AbsoluteCenter>
            </Card.Body>
            <Card.Footer>
                <Button 
                    loading={loading}
                    loadingText="Подождите..."
                    variant="solid"
                    style={{width: "100%"}}
                    onClick={downloadAllLogFiles}>
                    <LuDownload /> Скачать все логи из списка
                </Button>
            </Card.Footer>

        </Card.Root>
    );
}
LogPlaceTypeCard.propTypes = {
    headingText: PropTypes.string,
    logList: PropTypes.array,
    loading: PropTypes.bool,
    selectedLog: PropTypes.object,
    onSelectLog: PropTypes.func
};

function LogViewChoser({ loading }) {
    return (
        
        <Flex direction={"row"} align={"end"} justify={"start"} gap={"2"} >
            <Tooltip
                content={"Скачать все логи"}
            >    
                <Button 
                    size={"xs"}
                    loading={loading}
                    variant="outline">
                    <LuDownload />
                </Button>
            </Tooltip>
            <Box>
                <SelectRoot size={"xs"} defaultValue={"500"}>
                    <SelectLabel>Количество отображаемых строк:</SelectLabel>
                    <SelectTrigger>
                        <SelectValueText placeholder="500"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem item="100">100</SelectItem>
                        <SelectItem item="250">250</SelectItem>
                        <SelectItem item="500">500</SelectItem>
                        <SelectItem item="1000">1000</SelectItem>
                        <SelectItem item="2500">2500</SelectItem>
                        <SelectItem item="5000">5000</SelectItem>
                    </SelectContent>
                </SelectRoot>
            </Box>
            <Tooltip
                content={"Просмотр выбранного файла"}
            >
                <Button 
                    size={"xs"}
                    loading={loading}
                    variant="outline">
                    <LuEye />
                </Button>
            </Tooltip>
        </Flex>
        
    );
}
LogViewChoser.propTypes = {
    loading: PropTypes.bool
};

function LogChooser({ apiEndpoint }) {
    const [internalLogs, setInternalLogs] = useState([]);
    const [sdLogs, setSdLogs] = useState([]);
    const [selectedLog, setSelectedLog] = useState({type: null, name: null});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch(apiEndpoint);
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.code === 200) {
                    setInternalLogs(result.data.internal || []);
                    setSdLogs(result.data.sd || []);
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
                setLoading(false);
            }
        };

        fetchLogs();
    }, [apiEndpoint]);

    return (
        <Stack>
            
            <Container maxW={"xl"}>
                <Heading>Выберите файл</Heading>
            </Container>
            
            <LogViewChoser loading={loading} />

            <Flex gap={"4"} justify={"center"}>
                <LogPlaceTypeCard 
                    headingText={"Логи на SD карте роутера"}  
                    loading={loading}
                    logList={sdLogs}
                    selectedLog={selectedLog}
                    onSelectLog={(name) => setSelectedLog({ type: "Логи на SD карте роутера", name })}/>
                <LogPlaceTypeCard 
                    headingText={"Логи во внутренней памяти роутера"} 
                    loading={loading}
                    logList={internalLogs}
                    selectedLog={selectedLog}
                    onSelectLog={(name) => setSelectedLog({ type: "Логи во внутренней памяти роутера", name })}/>
            </Flex>
            
            
        </Stack>
    );
}
LogChooser.propTypes = {
    apiEndpoint: PropTypes.string
};

function LogPage() {
    return (
        <Container maxW={"4xl"}>
            <LogChooser apiEndpoint={"/api/v1/getLogfilesList"} />
        </Container>
    );
}

export default LogPage;
