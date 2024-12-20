import { useState } from "react";
import { Container, Text, Box, Em } from "@chakra-ui/react";
import PropTypes from "prop-types";

import LogSourceManager from "./LogSourceManager";
import LogProvider from "../../providers/LogProvider/LogProvider";
import { useLogContext } from "../../providers/LogProvider/LogContext";

function LogTextArea({ onBackBtnClick }) {
    const { logData } = useLogContext();
    return (
        <Box>
            <Text>Log name: <Em>{logData.name}</Em></Text>
            <Text>Log creation date: <Em>{logData.createdAt}</Em></Text>
            <Text>Log size: <Em>{logData.size}</Em></Text>
            <Text>Log type: <Em>{logData.type}</Em></Text>
            <Text>Log rows: <Em>{logData.rows}</Em></Text>
            <button onClick={onBackBtnClick}>Back</button>
        </Box>
    );
}
LogTextArea.propTypes = {
    logParams: PropTypes.string,
    onBackBtnClick: PropTypes.func,
};

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
        <Container maxW={"4xl"}>
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
                        >
                            <LogTextArea
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
