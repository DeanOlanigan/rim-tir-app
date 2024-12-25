import { useEffect, useState } from "react";
import { Flex, Heading, Stack } from "@chakra-ui/react";
import { toaster } from "../../../components/ui/toaster";
import LogSelectionCard from "./LogSelectionCard";
import LogFileViewerControls from "./LogFileViewerControls";
import PropTypes from "prop-types";


function LogSourceManager() {
    const [logs, setLogs] = useState({ internal: [], sd: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch("/api/v1/getLogfilesList");
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.code === 200) {
                    setLogs({
                        internal: result.data.internal || [],
                        sd: result.data.sd || []
                    });
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
    }, []);

    return (
        <Stack 
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Heading>Выберите файл</Heading>

            <LogFileViewerControls 
                loading={loading}
            />

            <Flex gap={"4"} justify={"center"}>
                <LogSelectionCard 
                    headingText={"Логи на SD карте роутера"}  
                    loading={loading}
                    logList={logs.sd}
                />  
                <LogSelectionCard 
                    headingText={"Логи во внутренней памяти роутера"} 
                    loading={loading}
                    logList={logs.internal}
                />
            </Flex>
            
            
        </Stack>
    );
}
LogSourceManager.propTypes = {
    apiEndpoint: PropTypes.string
};

export default LogSourceManager;
