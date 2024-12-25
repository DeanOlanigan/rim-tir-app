import { useState } from "react";
import { LogContext } from "./LogContext";
import PropTypes from "prop-types";

function LogProvider({ children }) {
    const [logData, setLogData] = useState({
        name: "",
        size: "",
        createdAt: "",
        type: "",
        rows: "500",
    });

    const updateLogData = (data) => {
        setLogData((prev) => ({ ...prev, ...data }));
    };

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
