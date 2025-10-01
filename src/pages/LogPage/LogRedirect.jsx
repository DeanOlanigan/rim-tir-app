import { Navigate } from "react-router-dom";
import { useHasChosenLog } from "./Store/store";

export default function LogRedirect() {
    const hasChosenLog = useHasChosenLog();
    if (hasChosenLog) return <Navigate to="viewer" replace />;
    return <Navigate to="settings" replace />;
}
