import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGraphStore } from "./GraphStore";

export default function RequireGraphData() {
    //console.log("Render RequireGraphData");
    const [isHydrated, setIsHydrated] = useState(false);

    const wsMessage = useGraphStore(state => state.wsMessageZus);
    const hasGraphMessage = Boolean(
        wsMessage.graph && Object.keys(wsMessage.graph).length > 0
    );

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    if (!isHydrated) return;

    // Если нет данных, отправляем пользователя на настройки
    if (!hasGraphMessage) {
        return <Navigate to="/graph/settings" replace />;
    }

    // Иначе рендерим вложенный маршрут (GraphViewer)
    return <Outlet />;
}
