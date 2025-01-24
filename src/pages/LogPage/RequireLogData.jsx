import { Navigate, Outlet } from "react-router-dom";
//import { useAtomValue } from "jotai";
//import { wsMessageAtom } from "./atoms";

import { useLogContext } from "../../providers/LogProvider/LogContext";

export default function RequireLogData() {
    console.log("Render RequireLogData");
    const { hasChosenLog } = useLogContext();

    //const wsMessage = useAtomValue(wsMessageAtom);
    //const hasGraphMessage = Boolean(wsMessage.graph && Object.keys(wsMessage.graph).length > 0);

    // Если нет данных, отправляем пользователя на настройки
    if (!hasChosenLog) {
        return <Navigate to="/log/settings" replace />;
    }
    console.warn("hasChosenLog", hasChosenLog);
    // Иначе рендерим вложенный маршрут (GraphViewer)
    return <Outlet />;
}
