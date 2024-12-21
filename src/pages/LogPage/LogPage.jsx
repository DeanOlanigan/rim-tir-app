import { useState } from "react";
import { Container, Box } from "@chakra-ui/react";

import LogSourceManager from "./LogSourceManager";
import LogProvider from "../../providers/LogProvider/LogProvider";
import LogViewer from "./LogViewer";

function LogPage() {
    const [viewMode, setViewMode] = useState("manager");
    const [state, setState] = useState(true);

    const handleViewBtnClick = () => {
        setState(false);
        setTimeout(() => {
            setViewMode("textarea");
        }, 300);
    };

    const handleBackBtnClick = () => {
        setState(true);
        setTimeout(() => {
            setViewMode("manager");
        }, 300);
    };

    return (
        <Container maxW={"6xl"} h={"100%"}>
            <LogProvider>
                {
                    viewMode === "manager" ? (
                        <Box 
                            data-state={state ? "open" : "closed"}
                            animationDuration={"slow"}
                            animationStyle={{
                                _open: "scale-fade-in",
                                _closed: "scale-fade-out",
                            }}
                        >
                            <LogSourceManager
                                apiEndpoint={"/api/v1/getLogfilesList"}
                                onViewBtnClick={handleViewBtnClick}
                            />
                        </Box>
                    ) : (
                        <Box
                            data-state={state ? "closed" : "open"}
                            animationDuration={"slow"}
                            animationStyle={{
                                _open: "scale-fade-in",
                                _closed: "scale-fade-out",
                            }}
                            h={"100%"}
                        >
                            <LogViewer
                                onBackBtnClick={handleBackBtnClick}
                            />
                        </Box>
                    )
                }
            </LogProvider>
        </Container>
    );
}

export default LogPage;
