import { Routes, Route } from "react-router-dom";
import { Container } from "@chakra-ui/react";
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
            <Routes>
                <Route index element={<LogSourceManager />} />
                <Route path="viewer" element={<LogViewer />} />
            </Routes>
        </Container>
    );
}

export default LogPage;
