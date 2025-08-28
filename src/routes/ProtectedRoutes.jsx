import { useEffect } from "react";
//import { useAuthContext } from "@/providers/AuthProvider/AuthContext";
import { Toaster, toaster } from "@/components/ui/toaster";
import Header from "@/components/Header/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

function ProtectedRoutes() {
    console.log("Render ProtectedRoutes");
    const { checkAuth, extendSession } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        const verifyAuthentication = async () => {
            const isAuth = await checkAuth();
            console.log("IsAuth: ", isAuth);
            if (isAuth !== true) {
                navigate("/login", { replace: true });
                return;
            }
        };
        verifyAuthentication();
    }, [navigate]);

    /*useEffect(() => {
        const interval = setInterval(() => {
            console.log("Check DeathTime");
            extendSession();
        }, 10*1000);

        return () => clearInterval(interval);
    }, [extendSession]);*/

    return (
        <>
            <Toaster />
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default ProtectedRoutes;
