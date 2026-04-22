import { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext({
  darkMode: false,
  setDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("nexus_dark") === "true";
  });

  useEffect(() => {
    localStorage.setItem("nexus_dark", darkMode);
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};