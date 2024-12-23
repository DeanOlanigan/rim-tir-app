import { useState, useReducer } from "react";
import { LogContext } from "./LogContext";
import PropTypes from "prop-types";

const initialState = {
    isPaused: false,
    isLogTextWrapped: false,
    logTextSize: 14,
    currentFilter: { WARNING: true, ERROR: true, INFO: true },
    logs: []
};

function logReducer(state, action) {
    switch (action.type) {
    case "ADD_LOGS":
        return { ...state, logs: [...state.logs, ...action.payload] };
    case "CLEAR_LOGS":
        return { ...state, logs: [] };
    case "TOGGLE_WRAP":
        return { ...state, isLogTextWrapped: !state.isLogTextWrapped };
    case "TOGGLE_PAUSE":
        return { ...state, isPaused: !state.isPaused };
    case "SET_FILTER":
        return { ...state, currentFilter: action.payload };
    case "SET_TEXT_SIZE":
        return { ...state, logTextSize: action.payload };
    default:
        return state;
    }
}

function LogProvider({ children }) {
    const [logData, setLogData] = useState({
        name: "",
        size: "",
        createdAt: "",
        type: "",
        rows: "500",
    });
    const [isLogLoaded, setIsLogLoaded] = useState(false);
    const [state, dispatch] = useReducer(logReducer, initialState);

    const updateLogData = (data) => {
        setLogData((prev) => ({ ...prev, ...data }));
    };

    return (
        <LogContext.Provider 
            value={{
                logData,
                updateLogData,
                isLogLoaded,
                setIsLogLoaded,
                state, dispatch
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
