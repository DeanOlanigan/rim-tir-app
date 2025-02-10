import { createContext, useContext } from "react";

// Создаем контекст
export const ConfigurationVariableContext = createContext();

// Хук для использования контекста
export const useConfigurationVariableContext = () => {
    const context = useContext(ConfigurationVariableContext);
    if (!context) {
        throw new Error("useConfigurationVariableContext must be used within a ConfigurationVariableProvider");
    }
    return context;
};
