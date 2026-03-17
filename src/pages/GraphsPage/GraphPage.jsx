import { useGraphStore } from "./store/store";
import GraphViewer from "./Viewer/GraphViewer";
import GraphSettings from "./GraphSettings/GraphSettings";
import { Container } from "@chakra-ui/react";

function GraphPage() {
    const showGraph = useGraphStore((state) => state.showGraph);
    return showGraph ? (
        <GraphViewer />
    ) : (
        <Container h={"100%"} maxW={"6xl"}>
            <GraphSettings />
        </Container>
    );
}

export default GraphPage;
