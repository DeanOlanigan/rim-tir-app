import { useEffect, useState } from "react";
import { LogContext } from "./LogContext";

//import { useNavigate } from "react-router-dom";

function LogProvider({ children }) {
    const savedSettings =
        JSON.parse(localStorage.getItem("user-settings")) || {};
    //const navigate = useNavigate();
    //const [isLoading, setIsLoading] = useState(true);

    const [logData, setLogData] = useState({
        name: "",
        size: "",
        createdAt: "",
        type: "",
        rows: savedSettings?.logRowsCount || "500",
    });

    const [hasChosenLog, setHasChosenLog] = useState(
        Boolean(localStorage.getItem("chosenLog"))
    );

    const updateLogData = (data) => {
        setLogData((prev) => ({ ...prev, ...data }));
    };

    const saveChosenLogToLocalStorage = () => {
        localStorage.setItem("chosenLog", JSON.stringify(logData));
        setHasChosenLog(true);
    };

    const removeChosenLogFromLocalStorage = () => {
        localStorage.removeItem("chosenLog");
        setHasChosenLog(false);
    };

    const checkChosenLog = () => {
        const chosenLog = localStorage.getItem("chosenLog");
        if (chosenLog) {
            setLogData(JSON.parse(chosenLog));
            //navigate("/log/viewer");
        }
        //setIsLoading(false);
    };

    useEffect(() => {
        console.log("LogProvider useEffect checkChosenLog triggered");
        checkChosenLog();
    }, []);

    useEffect(() => {
        const oldSettings =
            JSON.parse(localStorage.getItem("user-settings")) || {};
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
                saveChosenLogToLocalStorage,
                removeChosenLogFromLocalStorage,
                /* isLoading */
                hasChosenLog,
            }}
        >
            {children}
        </LogContext.Provider>
    );
}

export default LogProvider;
