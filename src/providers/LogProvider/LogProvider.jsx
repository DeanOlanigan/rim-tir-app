import { useEffect, useState } from "react";
import { LogContext } from "./LogContext";
import PropTypes from "prop-types";

function LogProvider({ children }) {
    const savedSettings = JSON.parse(localStorage.getItem("user-settings")) || {};

    const [logData, setLogData] = useState({
        name: "",
        size: "",
        createdAt: "",
        type: "",
        rows: savedSettings?.logRowsCount || "500",
    });

    const updateLogData = (data) => {
        setLogData((prev) => ({ ...prev, ...data }));
    };

    useEffect(() => {
        const oldSettings = JSON.parse(localStorage.getItem("user-settings")) || {};
        const updatedSettings = {
            ...oldSettings,
            logRowsCount: logData.rows,
        };
        localStorage.setItem("user-settings", JSON.stringify(updatedSettings));
    }, [logData.rows]);

    return (
        <LogContext.Provider 
            value={{
                logData,
                updateLogData,
            }}
        >
            {children}
        </LogContext.Provider>
    );
};
LogProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default LogProvider;
