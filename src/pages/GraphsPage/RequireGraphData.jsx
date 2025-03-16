import { Navigate, Outlet } from "react-router-dom";
import { useAtomValue } from "jotai";
import { wsMessageAtom } from "./atoms";
import { useEffect, useState } from "react";

export default function RequireGraphData() {
    //console.log("Render RequireGraphData");
    const [isHydrated, setIsHydrated] = useState(false);

    const wsMessage = useAtomValue(wsMessageAtom);
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
