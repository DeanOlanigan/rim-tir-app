import { createContext, useContext } from "react";

// Создаем контекст
export const JournalContext = createContext();

// Хук для использования контекста
export const useJournalContext = () => {
    const context = useContext(JournalContext);
    if (!context) {
        throw new Error("useLogContext must be used within a LogProvider");
    }
    return context;
};
