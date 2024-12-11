import { useState, useEffect } from "react";
import { Theme } from "@radix-ui/themes";
import ThemeContext from "../context/ThemeContext";
import PropTypes from "prop-types";

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <Theme appearance={theme} accentColor="grass" grayColor="slate">
                {children}
            </Theme>
        </ThemeContext.Provider>
    );
};

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ThemeContext;
