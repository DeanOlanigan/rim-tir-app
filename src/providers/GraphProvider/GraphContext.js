import { createContext, useContext } from "react";

// Создаем контекст
export const GraphContext = createContext();

// Хук для использования контекста
export const useGraphContext = () => {
    const context = useContext(GraphContext);
    if (!context) {
        throw new Error("useGraphContext must be used within a GraphProvider");
    }
    return context;
};
