import React, { createContext, useState, useContext, useEffect } from "react";

// Create Theme Context
const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
});

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check local storage for saved theme or default to dark
    return localStorage.getItem("app-theme") || "dark";
  });

  // Update local storage when theme changes
  useEffect(() => {
    localStorage.setItem("app-theme", theme);
    // Add theme class to body for CSS targeting
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => useContext(ThemeContext);
