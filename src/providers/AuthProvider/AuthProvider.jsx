import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { QueryClient, QueryClientProvider, useMutation, useQueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                if (error.status === 401) return false;
                return failureCount < 2;
            }
        }
    }
});

const checkAuth = async () => {
    //const sessionExpirationTime = localStorage.getItem("session_expiration_time");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const respones = fetch("/api/v2/checkToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(refreshToken)
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

    /*const [sessionExpirationTime, setSessionExpirationTime] = useState(
        localStorage.getItem("session_expiration_time")
    );*/
    /*const [sessionTimeLeft, setSessionTimeLeft] = useState(0);*/
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

    /*const login = (data) => {
        /*const serverCurrentTime = parseInt(data.serverTime, 10);
        const clientCurrentTime = Math.floor(Date.now() / 1000);
        const timeDiff = serverCurrentTime - clientCurrentTime;

        const sessionTime = parseInt(data.sessionTimeLeft, 10);
        const sessionExpirationTime = clientCurrentTime + timeDiff + sessionTime;

        localStorage.setItem("session_expiration_time", sessionExpirationTime);
        localStorage.setItem("session_time", sessionTime);
        localStorage.setItem("csrf", data.csrfToken);

        setIsAuthenticated(true);
        setSessionExpirationTime(sessionExpirationTime);
        setSessionTimeLeft(sessionTime);
        console.log("login", sessionExpirationTime);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        setIsAuthenticated(true);
    }*/

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

    /*const logout = async () => {      
        console.log("logout");
        setIsAuthenticated(false);
        setSessionExpirationTime(0);
        setSessionTimeLeft(0);
        const response = await fetch("/api/v2/logout", { methond: "POST", body: JSON.stringify(localStorage.getItem("refreshToken"))});
        if (!response.status !== 200) return alert("Logout failed");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        /* API запрос на сервер, чтобы тот удалил сессию */
    /* const response = await fetch("/api/v1/logout",{ method: "POST", credentials: "include" });
        if (!response.ok) {
            alert("Logout failed");
        } 
    };*/

    /*const extendSession = async () => {      
        console.log("extendSession");
        const response = await fetch("/api/v1/extendSession", { method: "GET", credentials: "include" });
        console.log(await response.json());
        if (response.ok) {
            let clientCurrentTime = Math.floor(Date.now() / 1000);
            let sessionExpirationTime = clientCurrentTime + sessionTimeLeft;
            console.log("extendSession sessionExpirationTime", sessionExpirationTime);
            setSessionExpirationTime(sessionExpirationTime);
            localStorage.setItem("session_expiration_time", sessionExpirationTime);
            return true;
        } else {
            return false;
        }
    };*/

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
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={{ isAuthenticated, accessToken, logout, login, extendSession, isLoggingIn: loginMutation.isPending, isLoggingOut: logoutMutation.isPending }}>
                {children}
            </AuthContext.Provider>
        </QueryClientProvider>
    );
};

export default AuthProvider;
