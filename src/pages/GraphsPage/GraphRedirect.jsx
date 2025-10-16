import { Navigate } from "react-router-dom";
import { useGraphStore } from "./store/store";

export default function GraphRedirect() {
    const showGraph = useGraphStore((state) => state.showGraph);
    if (showGraph) return <Navigate to="viewer" replace />;
    return <Navigate to="settings" replace />;
}
