import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const checkAuth = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const respones = fetch("/api/v2/checkToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accessToken)
    });
    const result = await respones.json();
    //const csrf = localStorage.getItem("csrf");
    if (accessToken && refreshToken && result.result) {
        return true;
    } else {
        return false;
    }
    
};

function AuthProvider({ children }) {
    useEffect(() => {
        checkAuth();
    }, []);
    const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());
    console.log(isAuthenticated + "12314");
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));
    const queryClientInt = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: async (credentials) => {
            const response = await fetch("/api/v2/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.msg || "Login Failed");
            }
            return response.json();
        },
        onSuccess: (data) => {
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            setIsAuthenticated(true);
        },

        onError: (error) => {
            console.error("Login error", error.message);
        }
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            console.log("logout");
            const response = await fetch("/api/v2/logout", { methond: "POST", body: JSON.stringify(localStorage.getItem("refreshToken"))});
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.msg);
            };
        },
        onSuccess: () => {
            setIsAuthenticated(false);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setAccessToken(null);
            setRefreshToken(null);
            queryClientInt.clear();
        },
        onError: (error) => {
            console.error("Logout Error", error.message);
            setIsAuthenticated(false);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setAccessToken(null);
            setRefreshToken(null);
            queryClientInt.clear();
        }
    });

    const refreshMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch("api/v2/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.msg);
            }
        },

        onSuccess: (data) => {
            const newAccessToken = data.accessToken;
            setAccessToken(newAccessToken);
            localStorage.setItem("accessToken", newAccessToken);
            console.log("Token has been refreshed");
        },

        onError: (error) => {
            console.error("Refreshing Error", error.message);
            logoutMutation.mutate();
        }
    });

    const login = (credentials) => {
        loginMutation.mutate(credentials);
    };

    const logout = () => {
        logoutMutation.mutate();
    };

    const extendSession = () => {
        refreshMutation.mutate();
    };

    useEffect(() => {
        if (accessToken) {
            try {
                const payload = JSON.parse(atob(accessToken.split(".")[1]));
                if (payload.deathTime <= Date.now() && refreshToken) {
                    refreshMutation.mutate();
                }
            } catch (error) {
                console.error("Error with refreshing token" + error.msg);
            }
        };
    }, []);


    return (

        <AuthContext.Provider value={{ isAuthenticated, accessToken, logout, login, extendSession, isLoggingIn: loginMutation.isPending, isLoggingOut: logoutMutation.isPending }}>
            {children}
        </AuthContext.Provider>

    );
};

export default AuthProvider;
