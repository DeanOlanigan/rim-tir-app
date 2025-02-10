import { Navigate } from "react-router-dom";
import { useAuthContext } from "../providers/AuthProvider/AuthContext";

export const Redirect = () => {
    console.log("Render Redirect");

    const { isAuthenticated } = useAuthContext();

    if (isAuthenticated) {
        return <Navigate to="/configuration" replace />;
    }

    return <Navigate to="/login" replace />;
};
