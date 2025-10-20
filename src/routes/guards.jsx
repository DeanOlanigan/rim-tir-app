import { Navigate, Outlet, useLocation } from "react-router-dom";

export const AuthGate = () => {
    const isAuthenticated = true;
    const loc = useLocation();
    if (!isAuthenticated)
        return <Navigate to="/login" replace state={{ from: loc }} />;
    return <Outlet />;
};
