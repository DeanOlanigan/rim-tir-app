import { useReducer } from "react";
import { ConfigurationVariableContext } from "./ConfigurationVariableContext";
import { config } from "../../pages/MonitoringPage/testData";

function initialState() {
    return config;
};

function reducer(state, action) {
};

export const ConfigurationVariableProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, undefined, initialState);

    return (
        <ConfigurationVariableContext.Provider value={{ state, dispatch }}>
            {children}
        </ConfigurationVariableContext.Provider>
    );
};
