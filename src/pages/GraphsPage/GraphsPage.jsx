import { Routes, Route } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import GraphSettings from "./GraphSettings/GraphSettings";
import GraphViewer from "./Viewer/GraphViewer";

function GraphsPage() {
    console.log("Render GraphsPage");

    return (
        <Container
            maxW={"6xl"}
            flex={"1"}
            display={"flex"}
            flexDirection={"column"}
            minH={"0"}
        >
            <Routes>
                <Route index element={<GraphSettings />} />
                <Route path="viewer" element={<GraphViewer />} />
            </Routes>
        </Container>
    );
}

export default GraphsPage;
