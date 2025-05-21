import { useEffect, useRef } from "react";
import { useAuthContext } from "@/providers/AuthProvider/AuthContext";
import { Toaster, toaster } from "@/components/ui/toaster";
import Header from "@/components/Header/Header";
import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoutes() {
    console.log("Render ProtectedRoutes");
    const { isAuthenticated, sessionExpirationTime, extendSession, logout } =
        useAuthContext();
    const toastId = useRef();

    const handleExtend = async () => {
        let result = await extendSession();
        if (result) {
            toaster.create({
                title: "Session extended",
                description: "Your session has been extended.",
                type: "success",
            });
        } else {
            toaster.create({
                title: "Error",
                description: "Failed to extend session.",
                type: "error",
            });
        }
        toastId.current = null;
    };

    useEffect(() => {
        console.log("ProtectedRoutes useEffect triggered");
        console.log(
            "ProtectedRoutes useEffect isAuthenticated:",
            isAuthenticated
        );
        console.log(
            "ProtectedRoutes useEffect sessionExpirationTime:",
            sessionExpirationTime
        );
        if (isAuthenticated && sessionExpirationTime) {
            const interval = setInterval(() => {
                const currentTime = Math.floor(Date.now() / 1000);
                const remainingTime = sessionExpirationTime - currentTime;
                if (sessionExpirationTime && remainingTime <= 5) {
                    if (!toastId.current) {
                        toastId.current = toaster.create({
                            title: "Session expired",
                            description:
                                "Your session has expired. Please log in again.",
                            type: "error",
                            duration: 4000,
                            action: {
                                label: "Login",
                                onClick: logout,
                            },
                            onStatusChange: (details) => {
                                if (details.status === "unmounted") {
                                    logout();
                                }
                            },
                        });
                    } else {
                        toaster.update(toastId.current, {
                            title: "Session expired",
                            description:
                                "Your session has expired. Please log in again.",
                            type: "error",
                            duration: 4000,
                            action: {
                                label: "Login",
                                onClick: logout,
                            },
                            onStatusChange: (details) => {
                                if (details.status === "unmounted") {
                                    logout();
                                }
                            },
                        });
                        toaster.pause(toastId.current);
                    }
                    clearInterval(interval);
                    /* logout();
                    navigate("/expired"); */
                } else if (sessionExpirationTime && remainingTime <= 65) {
                    console.log("session will expire soon", remainingTime - 5);
                    if (!toastId.current) {
                        toastId.current = toaster.create({
                            title: "Session expired soon",
                            description: `Your session will expire in ${
                                remainingTime - 5
                            } seconds.`,
                            type: "warning",
                            duration: remainingTime,
                            action: {
                                label: "Extend session",
                                onClick: handleExtend,
                            },
                        });
                        toaster.pause(toastId.current);
                    } else {
                        toaster.update(toastId.current, {
                            description: `Your session will expire in ${
                                remainingTime - 5
                            } seconds.`,
                        });
                    }
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    });

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

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
