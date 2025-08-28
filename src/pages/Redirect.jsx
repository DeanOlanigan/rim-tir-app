import { Navigate } from "react-router-dom";
//import { useAuthContext } from "@/providers/AuthProvider/AuthContext";
import { useAuth } from "@/hooks/useAuth";

export const Redirect = () => {
    //console.log("Render Redirect");

    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/configuration" replace />;
    }

    return <Navigate to="/login" replace />;
};
