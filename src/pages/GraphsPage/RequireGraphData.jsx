import { Navigate, Outlet } from "react-router-dom";
import { useGraphStore } from "./store/store";

export default function RequireGraphData() {
    const showGraph = useGraphStore((state) => state.showGraph);
    if (showGraph) return <Outlet />;
    return <Navigate to="/graph" replace />;
}
