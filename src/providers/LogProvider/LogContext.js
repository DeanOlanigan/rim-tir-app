import { createContext, useContext } from "react";

// Создаем контекст
export const LogContext = createContext();

// Хук для использования контекста
export const useLogContext = () => {
    const context = useContext(LogContext);
    if (!context) {
        throw new Error("useLogContext must be used within a LogProvider");
    }
    return context;
};