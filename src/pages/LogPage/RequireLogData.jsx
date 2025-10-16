import { Navigate, Outlet } from "react-router-dom";
import { useHasChosenLog } from "./Store/store";

export default function RequireLogData() {
    const hasChosenLog = useHasChosenLog();
    if (hasChosenLog) return <Outlet />;
    return <Navigate to="/log/settings" replace />;
}
