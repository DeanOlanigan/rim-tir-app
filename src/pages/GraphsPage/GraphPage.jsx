import { useGraphStore } from "./store/store";
import GraphViewer from "./Viewer/GraphViewer";
import GraphSettings from "./GraphSettings/GraphSettings";

function GraphPage() {
    const showGraph = useGraphStore((state) => state.showGraph);
    return showGraph ? <GraphViewer /> : <GraphSettings />;
}

export default GraphPage;
