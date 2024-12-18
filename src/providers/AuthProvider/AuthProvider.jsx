import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import PropTypes from "prop-types";
import { Box } from "@chakra-ui/react";

function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sessionExpirationTime, setSessionExpirationTime] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sessionTimeLeft, setSessionTimeLeft] = useState(0);
        
    useEffect(() => {
        console.log("AuthProvider useEffect triggered");
        const sessionDurationTime = localStorage.getItem("session_expiration_time");
        const csrf = localStorage.getItem("csrf");
        if (sessionDurationTime && csrf) {
            setIsAuthenticated(true);
            setSessionExpirationTime(sessionDurationTime);
        }
        setLoading(false);
    }, []);

    const login = (data) => {
        const serverCurrentTime = parseInt(data.serverTime, 10);
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
    };

    const logout = async () => {      
        console.log("logout");
        setIsAuthenticated(false);
        setSessionExpirationTime(0);
        setSessionTimeLeft(0);
        /* API запрос на сервер, чтобы тот удалил сессию */
        const response = await fetch("/api/v1/logout",{ method: "POST", credentials: "include" });
        if (response.ok) {
            
            localStorage.removeItem("session_expiration_time");
            localStorage.removeItem("session_time");
            localStorage.removeItem("csrf");
        } else {
            alert("Logout failed");
        }
    };

    const extendSession = async () => {      
        console.log("extendSession");
        const response = await fetch("/api/v1/extendSession",{ method: "GET", credentials: "include" });
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
    };

    if (loading) {
        console.log("Loading...");
        return (
            <Box bg={"bg"} w={"100vw"} h={"100vh"}/>
        );
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, sessionExpirationTime, logout, login, extendSession }}>
            {children}
        </AuthContext.Provider>
    );
};
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AuthProvider;
