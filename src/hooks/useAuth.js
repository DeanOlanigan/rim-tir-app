import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
    const navigate = useNavigate();
    const queryClientInt = useQueryClient();
    
    const [isAuthenticated, setIsAuthenticated] = useState(); 

    const checkMutation = useMutation({
        mutationFn: async () => {
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");
            const login = localStorage.getItem("login");
            const respones = await fetch("/api/v2/checkToken", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: accessToken, login, refreshToken: refreshToken})
            });
            //const csrf = localStorage.getItem("csrf");
            const answer = await respones.json();
            console.log(answer.answer, "hello");
            if (answer.answer && refreshToken) {
                return true;
            } else {
                return false;
            } 
        },
        onSuccess: (result) => {
            //setIsAuthenticated(result);
            console.log("Result is ", result);
        },
        onError: () => {
            console.log("ВСЕ ПЛОХО");
            setIsAuthenticated(false);
        }
    });

    const checkAuth = async () => {
        const result = checkMutation.mutateAsync();
        return result;
    };  

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
            localStorage.setItem("login", data.login);
            setIsAuthenticated(true);
            console.log(isAuthenticated + "LALALALALA");
            navigate("/configuration");
        },

        onError: (error) => {
            console.error("Login error", error.message);
            setIsAuthenticated(false);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            navigate("/login");
            console.log("logout");
            const accessToken = localStorage.getItem("accessToken");
            const login = localStorage.getItem("login");
            const data = {accessToken, login};
            const response = await fetch("/api/v3/loggingout", { method: "POST" , body: JSON.stringify(data) });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.msg);
            };
        },
        onSuccess: () => {
            setIsAuthenticated(false);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("login");
            queryClientInt.clear();
        },
        onError: (error) => {
            console.error("Logout Error", error.message);
            setIsAuthenticated(false);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("login");
            queryClientInt.clear();
        }
    });

    const refreshMutation = useMutation({
        mutationFn: async () => {
            const refreshToken = localStorage.getItem("refreshToken");
            const accessToken = localStorage.getItem("accessToken");
            const login = localStorage.getItem("login");
            if (refreshToken || accessToken || login) {
                const response = await fetch("/api/v3/refresh", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ refreshToken, login, accessToken }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.msg);
                }
                
                return response.json();
            }
            throw new Error("Unauthorizied");
        },

        onSuccess: (data) => {
            console.log("response ", data.accessToken);
            const newAccessToken = data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);
            console.log("Token has been refreshed");
        },

        onError: (error) => {
            console.error("Refreshing Error", error.message);
            //logoutMutation.mutate();
        }
    });

    const login = async (credentials) => {
        try {
            loginMutation.mutate(credentials);
            if (loginMutation.isError) throw loginMutation.error;
        } catch (error) {
            return error;
        }
    };

    const logout = () => {
        logoutMutation.mutate();
    };

    const extendSession = async () => {
        try {
            refreshMutation.mutate();
            if (refreshMutation.isError) throw refreshMutation.error;
        } catch (error) {
            return error;
        }
    };


    return {
        login,
        logout,
        extendSession,
        isLoggingIn: loginMutation.isPending,
        isLoggingOut: loginMutation.isPending,
        isAuthenticated,
        setIsAuthenticated,
        checkMutation,
        checkAuth,
        refreshMutation
    };

};



