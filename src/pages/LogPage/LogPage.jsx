import { Flex, Container, Heading, Text, Card, Box, Alert, Stack } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { RadioCardItem, RadioCardRoot } from "../../components/ui/radio-card";
import { DownloadIcon, EyeOpenIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function LogPlaceTypeCard({ headingText, logList, loading, selectedLog, onSelectLog }) {
    const handleSelect = (log) => {
        onSelectLog(log);
    };

    const downloadAllLogFiles = () => {
        let type = "";
        switch (headingText) {
        case "Логи на sd карте роутера":
            type = "sd";
            break;
        case "Логи во внутренней памяти роутера":
        default:
            type = "r";
            break;
        }
        const fetchDownload = async () => {
            try {
                const response = await fetch(`http://192.168.1.1:8080/api/v1/getArchive?archive=logs&type=${type}`);
                if (!response.ok) {
                    throw new Error(`Ошибка: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.code === 200) {
                    alert("TASK STARTED");
                } else {
                    throw new Error(result.message || "Неизвестная ошибка");
                }
            } catch (err) {
                throw new Error(`Ошибка: ${err.message}`);
            }
        };
        fetchDownload();
    };

    return (
        <Card.Root w={"100%"}>
            <Card.Header>
                <Card.Title>{headingText}</Card.Title>
            </Card.Header>
            <Card.Body>
                <Box h={"30vh"} overflowY={"auto"} pe="0.5em">
                    {logList && logList.length > 0 ? (
                        <RadioCardRoot 
                            gap={"2"}
                            size={"md"}
                            variant="subtle"
                            colorPalette={"red"}
                            onValueChange={(value) => handleSelect(value)}
                            value={selectedLog.type === headingText ? selectedLog.name : null}>
                            {logList.map((log, index) => (
                                <RadioCardItem 
                                    key={index}
                                    value={log}
                                    label={log}
                                />
                            ))}
                        </RadioCardRoot>
                    ) : (
                        <Text weight={"medium"} as="div" align={"center"} color="tomato">Не найдено</Text>
                    )}
                </Box>
            </Card.Body>
            <Card.Footer>
                <Button 
                    loading={loading}
                    loadingText="Подождите..."
                    variant="solid"
                    style={{width: "100%"}}
                    onClick={downloadAllLogFiles}>
                    <DownloadIcon width={18} height={18} /> Скачать все логи из списка
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
        
        <Flex direction={"row"} align={"end"} justify={"flex-end"} gap={"4"} >
            <Box>
                <SelectRoot defaultValue={"500"}>
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
            <Button loading={loading} variant="outline">
                <EyeOpenIcon width={18} height={18} />
            </Button>
        </Flex>
        
    );
}
LogViewChoser.propTypes = {
    loading: PropTypes.bool
};

function LogChooser({ apiEndpoint }) {
    const [rLogs, setRLogs] = useState([]);
    const [sLogs, setSLogs] = useState([]);
    const [selectedLog, setSelectedLog] = useState({type: null, name: null});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch(apiEndpoint);
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.code === 200) {
                    setRLogs(result.data.rLog || []);
                    setSLogs(result.data.sLog || []);
                } else {
                    throw new Error(result.message || "Неизвестная ошибка");
                }
            } catch (err) {
                setError(err.message);
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

            {error ? (
                <Alert.Root status={"error"}>
                    <Alert.Indicator>
                        <CrossCircledIcon />
                    </Alert.Indicator>
                    <Alert.Title>
                        {error}
                    </Alert.Title>
                </Alert.Root>
            ) : <></> }
            
            <Flex gap={"4"} justify={"center"}>
                <LogPlaceTypeCard 
                    headingText={"Логи на sd карте роутера"}  
                    loading={loading}
                    logList={sLogs}
                    selectedLog={selectedLog}
                    onSelectLog={(name) => setSelectedLog({ type: "Логи на sd карте роутера", name })}/>
                <LogPlaceTypeCard 
                    headingText={"Логи во внутренней памяти роутера"} 
                    loading={loading}
                    logList={rLogs}
                    selectedLog={selectedLog}
                    onSelectLog={(name) => setSelectedLog({ type: "Логи во внутренней памяти роутера", name })}/>
            </Flex>
            
            <LogViewChoser loading={loading} />
            
        </Stack>
    );
}
LogChooser.propTypes = {
    apiEndpoint: PropTypes.string
};

function LogPage() {
    return (
        <Container maxW={"4xl"}>
            <LogChooser apiEndpoint={"http://192.168.1.1:8080/api/v1/getLogfilesList"} />
        </Container>
    );
}

export default LogPage;
