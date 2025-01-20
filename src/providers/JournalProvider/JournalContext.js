import { createContext, useContext } from "react";

// Создаем контекст
export const JournalContext = createContext();

// Хук для использования контекста
export const useJournalContext = () => {
    const context = useContext(JournalContext);
    if (!context) {
        throw new Error("useJournalContext must be used within a JournalProvider");
    }
    return context;
};
