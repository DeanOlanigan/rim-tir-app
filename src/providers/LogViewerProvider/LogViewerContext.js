import { createContext, useContext } from "react";

// Создаем контекст
export const LogViewerContext = createContext();

// Хук для использования контекста
export const useLogViewerContext = () => {
    const context = useContext(LogViewerContext);
    if (!context) {
        throw new Error("useLogContext must be used within a LogProvider");
    }
    return context;
};