import { Navigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { wsMessageAtom } from "./atoms";

export default function GraphRedirect() {
    console.log("Render GraphRedirect");

    const wsMessage = useAtomValue(wsMessageAtom);
    const hasGraphMessage = Boolean(wsMessage.graph && Object.keys(wsMessage.graph).length > 0);

    // Если данные есть, сразу отправляем на Viewer
    if (hasGraphMessage) {
        return <Navigate to="viewer" replace />;
    }
    // Иначе — отправляем на страницу настроек
    return <Navigate to="settings" replace />;
}
