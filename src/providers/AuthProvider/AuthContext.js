import { createContext, useContext } from "react";

export const AuthContext = createContext();

// Хук для использования контекста
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within a AuthProvider");
    }
    return context;
};
