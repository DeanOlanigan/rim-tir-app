import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../providers/AuthProvider/AuthContext";
import { Toaster, toaster } from "./../components/ui/toaster";
import Header from "../components/Header/Header";
import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoutes() {
    const { isAuthenticated, sessionExpirationTime, extendSession, logout } = useContext(AuthContext);
    const toastId = useRef();

    useEffect(() => {
        console.log("ProtectedRoutes useEffect isAuthenticated:", isAuthenticated);
        console.log("ProtectedRoutes useEffect sessionExpirationTime:", sessionExpirationTime);
        if (isAuthenticated && sessionExpirationTime) {
            const interval = setInterval(() => {
                const currentTime = Math.floor(Date.now() / 1000);
                const remainingTime = sessionExpirationTime - currentTime;
                if (sessionExpirationTime && remainingTime <= 1400) {
                    logout();
                } else if (sessionExpirationTime && remainingTime <= 1500) {
                    console.log("session will expire soon", remainingTime);
                    if (!toastId.current) {
                        toastId.current = toaster.create({
                            title: "Session expired soon",
                            description: `Your session will expire in ${remainingTime} seconds.`,
                            type: "loading",
                            action: {
                                label: "Extend session",
                                onClick: extendSession,
                            }
                        });
                    } else {
                        toaster.update(toastId.current, {
                            description: `Your session will expire in ${remainingTime} seconds.`,
                        });
                    }
                };
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isAuthenticated, sessionExpirationTime]);

    if (!isAuthenticated) {
        return (
            <Navigate to="/login" replace />
        );
    }

    return (
        <>
            <Toaster />
            <Header />
            <main style={{height: "100%"}}>
                <Outlet />
            </main>
        </>
    );
}

export default ProtectedRoutes;
