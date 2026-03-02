import { useSessionQuery } from "@/hooks/useSessionQuery";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const AuthGate = () => {
    const loc = useLocation();
    const sessionQuery = useSessionQuery();

    if (sessionQuery.isLoading) {
        return <div>Загрузка...</div>;
    }

    if (sessionQuery.isError) {
        return <Navigate to="/login" replace state={{ from: loc }} />;
    }

    const isAuthenticated = sessionQuery.data?.authenticated === true;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: loc }} />;
    }

    return <Outlet />;
};

export const GuestGate = () => {
    const sessionQuery = useSessionQuery();

    if (sessionQuery.isLoading) {
        return <div>Загрузка...</div>;
    }

    const isAuthenticated = sessionQuery.data?.authenticated === true;

    if (isAuthenticated) {
        return <Navigate to="/configuration" replace />;
    }

    return <Outlet />;
};
