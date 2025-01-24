import { Navigate } from "react-router-dom";
//import { useAtomValue } from "jotai";
//import { wsMessageAtom } from "./atoms";

import { useLogContext } from "../../providers/LogProvider/LogContext";

export default function LogRedirect() {
    console.log("Render LogRedirect");
    const { hasChosenLog } = useLogContext();

    //const wsMessage = useAtomValue(wsMessageAtom);
    //const hasGraphMessage = Boolean(wsMessage.graph && Object.keys(wsMessage.graph).length > 0);

    // Если данные есть, сразу отправляем на Viewer
    if (hasChosenLog) {
        return <Navigate to="viewer" replace />;
    }

    // Иначе — отправляем на страницу настроек
    return <Navigate to="settings" replace />;
}
