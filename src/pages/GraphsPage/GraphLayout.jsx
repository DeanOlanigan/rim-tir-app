import { Container } from "@chakra-ui/react";
import { useGraphStore } from "./store/store";
import GraphViewer from "./Viewer/GraphViewer";
import GraphSettings from "./GraphSettings/GraphSettings";

function GraphPage() {
    const showGraph = useGraphStore((state) => state.showGraph);

    return (
        <Container
            maxW={"6xl"}
            flex={"1"}
            display={"flex"}
            flexDirection={"column"}
            minH={"0"}
        >
            {showGraph ? <GraphViewer /> : <GraphSettings />}
        </Container>
    );
}

export default GraphPage;
