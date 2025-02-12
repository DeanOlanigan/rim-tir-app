import { useState } from "react";
import { AuthContext } from "./AuthContext";
import PropTypes from "prop-types";

const checkAuth = () => {
    const sessionExpirationTime = localStorage.getItem("session_expiration_time");
    const csrf = localStorage.getItem("csrf");
    if (sessionExpirationTime && csrf) {
        return true;
    }
};

function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());
    const [sessionExpirationTime, setSessionExpirationTime] = useState(
        localStorage.getItem("session_expiration_time")
    );
    const [sessionTimeLeft, setSessionTimeLeft] = useState(0);

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
        localStorage.removeItem("session_expiration_time");
        localStorage.removeItem("session_time");
        localStorage.removeItem("csrf");
        /* API запрос на сервер, чтобы тот удалил сессию */
        /* const response = await fetch("/api/v1/logout",{ method: "POST", credentials: "include" });
        if (!response.ok) {
            alert("Logout failed");
        } */
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
