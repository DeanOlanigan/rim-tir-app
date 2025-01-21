import { Routes, Route } from "react-router-dom";
import { Container } from "@chakra-ui/react";

import GraphProvider from "../../providers/GraphProvider/GraphProvider";
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
            <GraphProvider>
                <Routes>
                    <Route index element={<GraphSettings />} />
                    <Route path="viewer" element={<GraphViewer />} />
                </Routes>
            </GraphProvider>
        </Container>
    );
}

export default GraphsPage;
