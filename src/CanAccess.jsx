import { useAuth } from "./hooks/useAuth";
import { hasAllRights, hasAnyRight, hasRight } from "./utils/permissions";

export function CanAccess({ right, anyOf, allOf, children, fallback = null }) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) return fallback;

    let allowed = true;

    if (right) allowed = hasRight(user, right);
    if (allowed && anyOf) allowed = hasAnyRight(user, anyOf);
    if (allowed && allOf) allowed = hasAllRights(user, allOf);

    if (!allowed) return fallback;

    return children;
}
