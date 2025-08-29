import { useEffect } from "react";
//import { useAuthContext } from "@/providers/AuthProvider/AuthContext";
import { Toaster, toaster } from "@/components/ui/toaster";
import Header from "@/components/Header/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

function ProtectedRoutes() {
    console.log("Render ProtectedRoutes");
    const { extendSession } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        const verifyAuthentication = async () => {
            if (!localStorage.getItem("accessToken") || !localStorage.getItem("refreshToken")) {
                navigate("/login", { replace: true });
                return;
            }
        };
        verifyAuthentication();
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            console.log("Check DeathTime");
            await extendSession();
        }, 60*1000);

        return () => clearInterval(interval);
    }, [extendSession]);

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
