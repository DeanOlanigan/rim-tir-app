import { useEffect, useState } from "react";
import { Flex, Container, Heading, Stack } from "@chakra-ui/react";
import { toaster } from "../../components/ui/toaster";
import LogSelectionCard from "./LogSelectionCard";
import LogFileViewerControls from "./LogFileViewerControls";
import PropTypes from "prop-types";


function LogSourceManager({apiEndpoint, onViewBtnClick}) {
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
            
            <LogFileViewerControls 
                loading={loading} 
                selectedLog={selectedLog}
                onViewBtnClick={onViewBtnClick}
            />

            <Flex gap={"4"} justify={"center"}>
                <LogSelectionCard 
                    headingText={"Логи на SD карте роутера"}  
                    loading={loading}
                    logList={sdLogs}
                    selectedLog={selectedLog}
                    onSelectLog={(name) => setSelectedLog({ type: "Логи на SD карте роутера", name })}
                    onChooseLog={onViewBtnClick}
                />
                <LogSelectionCard 
                    headingText={"Логи во внутренней памяти роутера"} 
                    loading={loading}
                    logList={internalLogs}
                    selectedLog={selectedLog}
                    onSelectLog={(name) => setSelectedLog({ type: "Логи во внутренней памяти роутера", name })}
                    onChooseLog={onViewBtnClick}
                />
            </Flex>
            
            
        </Stack>
    );
}
LogSourceManager.propTypes = {
    apiEndpoint: PropTypes.string,
    onViewBtnClick: PropTypes.func
};

export default LogSourceManager;
