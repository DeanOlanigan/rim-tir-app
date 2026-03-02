import { useAuth } from "@/hooks/useAuth";
import { useSessionQuery } from "@/hooks/useSessionQuery";
import { hasAllRights, hasAnyRight, hasRight } from "@/utils/permissions";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const AuthGate = () => {
    const loc = useLocation();
    const sessionQuery = useSessionQuery();

    if (sessionQuery.isLoading) {
        return <div>Загрузка...</div>;
    }

    if (sessionQuery.isError) {
        return (
            <div>Не удалось проверить сессию: {sessionQuery.error.message}</div>
        );
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

    if (sessionQuery.isError) {
        return <Outlet />;
    }

    const isAuthenticated = sessionQuery.data?.authenticated === true;

    if (isAuthenticated) {
        return <Navigate to="/configuration" replace />;
    }

    return <Outlet />;
};

export function PermissionGate({ right, anyOf, allOf, redirectTo = "/403" }) {
    const location = useLocation();
    const { isLoading, isError, isAuthenticated, user } = useAuth();

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (isError) {
        return <div>Не удалось проверить сессию</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    let allowed = true;

    if (right) allowed = hasRight(user, right);
    if (allowed && anyOf) allowed = hasAnyRight(user, anyOf);
    if (allowed && allOf) allowed = hasAllRights(user, allOf);

    if (!allowed) {
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
}
