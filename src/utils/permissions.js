import { authKeys } from "@/api/queryKeys";
import { queryClient } from "@/queryClients";

export function hasRight(user, right) {
    if (!right) return true;
    return !!user?.rights?.includes(right);
}

export function hasAnyRight(user, rights) {
    if (!rights?.length) return true;
    const userRights = new Set(user?.rights ?? []);
    return rights.some((right) => userRights.has(right));
}

export function hasAllRights(user, rights) {
    if (!rights?.length) return true;
    const userRights = new Set(user?.rights ?? []);
    return rights.every((right) => userRights.has(right));
}

export function getAuthSnapshot() {
    const data = queryClient.getQueryData(authKeys.session());

    return {
        data,
        isAuthenticated: data?.authenticated === true,
        user: data?.user ?? null,
        rights: data?.user?.rights ?? [],
    };
}

export function runGuardedAction({
    right,
    action,
    onUnauthorized,
    onForbidden,
}) {
    const { isAuthenticated, user, rights } = getAuthSnapshot();

    if (!isAuthenticated || !user) {
        onUnauthorized?.();
        return false;
    }

    if (right && !rights.includes(right)) {
        onForbidden?.();
        return false;
    }

    return action();
}
