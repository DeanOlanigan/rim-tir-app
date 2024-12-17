import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import PropTypes from "prop-types";
import { Box } from "@chakra-ui/react";

function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sessionExpirationTime, setSessionExpirationTime] = useState(0);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        console.log("AuthProvider useEffect isAuthenticated:", isAuthenticated);
        console.log("AuthProvider useEffect sessionExpirationTime:", sessionExpirationTime);
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

        const sessionTimeLeft = parseInt(data.sessionTimeLeft, 10);
        const sessionExpirationTime = clientCurrentTime + timeDiff + sessionTimeLeft;

        localStorage.setItem("session_expiration_time", sessionExpirationTime);
        localStorage.setItem("csrf", data.csrfToken);

        setIsAuthenticated(true);
        setSessionExpirationTime(sessionExpirationTime);
        console.log("login", sessionExpirationTime);
    };

    const logout = async () => {      
        console.log("logout");
        setIsAuthenticated(false);
        setSessionExpirationTime(0);
        /* API запрос на сервер, чтобы тот удалил сессию */
        const response = await fetch("/api/v1/logout",{ method: "POST", credentials: "include" });
        if (response.ok) {
            
            localStorage.removeItem("session_expiration_time");
            localStorage.removeItem("csrf");
        } else {
            alert("Logout failed");
        }
    };

    const extendSession = async () => {      
        console.log("extendSession");
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
