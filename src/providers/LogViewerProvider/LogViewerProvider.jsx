import { useReducer, useMemo, useEffect } from "react";
import { LogViewerContext } from "./LogViewerContext";
import PropTypes from "prop-types";

function initialState() {
    const savedSettings = JSON.parse(localStorage.getItem("user-settings")) || {};
    return {
        isPaused: false,
        isLogTextWrapped: savedSettings.isLogTextWrapped ?? false,
        logTextSize: savedSettings.logTextSize ?? 14,
        currentFilter: {
            WARNING: true,
            ERROR: true,
            INFO: true,
        },
        logs: [],
        pausedLogs: [],
    };
};

function reducer(state, action) {
    switch (action.type) {
    case "SET_PAUSED":
        return {
            ...state,
            isPaused: action.payload,
            logs: action.payload 
                ? [...state.logs, { severity: "STATUS", message: "Paused" }]
                : [...state.logs, ...state.pausedLogs, { severity: "STATUS", message: "Resumed" }],
            pausedLogs: action.payload ? [] : [],
        };
    case "TOGGLE_WRAP":
        return { ...state, isLogTextWrapped: action.payload };
    case "SET_TEXT_SIZE":
        return { ...state, logTextSize: action.payload };
    case "SET_FILTER":
        return { ...state, currentFilter: action.payload };
    case "ADD_LOGS":
        if (state.isPaused) {
            return {
                ...state,
                pausedLogs: [...state.pausedLogs, ...action.payload],
            };
        }
        return {
            ...state,
            logs: [...state.logs, ...action.payload], 
        };
    case "SET_PAUSED_LOGS":
        return {
            ...state,
            pausedLogs: [ ...state.pausedLogs, ...action.payload]
        };
    default:
        return state;
    }
}

function LogViewerProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, undefined, initialState);

    useEffect(() => {
        const savedSettings = JSON.parse(localStorage.getItem("user-settings")) || {};
        const userSettings = {
            ...savedSettings,
            isLogTextWrapped: state.isLogTextWrapped,
            logTextSize: state.logTextSize 
        };
        localStorage.setItem("user-settings", JSON.stringify(userSettings));
    }, [state.isLogTextWrapped, state.logTextSize]);

    const value = useMemo(() => ({
        ...state,
        setIsPaused: (isPaused) => dispatch({ type: "SET_PAUSED", payload: isPaused }),
        toggleWrap: () => dispatch({ type: "TOGGLE_WRAP", payload: !state.isLogTextWrapped }),
        setLogTextSize: (logTextSize) => dispatch({ type: "SET_TEXT_SIZE", payload: logTextSize }),
        setCurrentFilter: (currentFilter) => dispatch({ type: "SET_FILTER", payload: currentFilter }),
        setLogs: (logs) => dispatch({ type: "ADD_LOGS", payload: logs }),
        setPausedLogs: (pausedLogs) => dispatch({ type: "SET_PAUSED_LOGS", payload: pausedLogs }),
    }), [state]);

    return (
        <LogViewerContext.Provider value={value}>
            {children}
        </LogViewerContext.Provider>
    );
}
LogViewerProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default LogViewerProvider;
