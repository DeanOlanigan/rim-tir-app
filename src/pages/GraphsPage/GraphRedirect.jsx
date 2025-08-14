import { Navigate } from "react-router-dom";
import { useGraphStore } from "./GraphStore";

export default function GraphRedirect() {
    //console.log("Render GraphRedirect");

    const wsMessage = useGraphStore(state => state.wsMessageZus);
    const hasGraphMessage = Boolean(
        wsMessage.graph && Object.keys(wsMessage.graph).length > 0
    );

    // Если данные есть, сразу отправляем на Viewer
    if (hasGraphMessage) {
        return <Navigate to="viewer" replace />;
    }
    // Иначе — отправляем на страницу настроек
    return <Navigate to="settings" replace />;
}
