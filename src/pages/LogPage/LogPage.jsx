import { Routes, Route } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import LogProvider from "@/providers/LogProvider/LogProvider";
import LogSourceManager from "./SourceManager/LogSourceManager";
import LogViewer from "./Viewer/LogViewer";

function LogPage() {
    console.log("Render LogPage");
    return (
        <Container
            maxW={"6xl"}
            flex={"1"}
            display={"flex"}
            flexDirection={"column"}
            minH={"0"}
        >
            <LogProvider>
                <Routes>
                    <Route index element={<LogSourceManager />} />
                    <Route path="viewer" element={<LogViewer />} />
                </Routes>
            </LogProvider>
        </Container>
    );
}

export default LogPage;
