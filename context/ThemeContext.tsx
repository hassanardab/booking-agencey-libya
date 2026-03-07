import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme as useDeviceColorScheme } from "react-native";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  colors: typeof lightColors;
}

const lightColors = {
  bg: "#F8FAFC",
  primary: "#6366F1",
  textMain: "#1E293B",
  textSub: "#64748B",
  white: "#FFFFFF",
  cardBorder: "#E2E8F0",
  accent: "#F1F5F9",
  iconSquareBg: "#EEF2FF",
  // Add other colors as needed
};

const darkColors: typeof lightColors = {
  bg: "#0F172A",
  primary: "#818CF8",
  textMain: "#F1F5F9",
  textSub: "#94A3B8",
  white: "#1E293B",
  cardBorder: "#334155",
  accent: "#1E293B",
  iconSquareBg: "#1E1E2F",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const deviceTheme = useDeviceColorScheme(); // 'light' or 'dark'
  const [theme, setThemeState] = useState<ThemeMode>("light");

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem("appTheme");
        if (saved === "light" || saved === "dark") {
          setThemeState(saved);
        } else {
          // Default to device theme
          setThemeState(deviceTheme || "light");
        }
      } catch (error) {
        console.error("Failed to load theme", error);
      }
    };
    loadTheme();
  }, []);

  const setTheme = async (mode: ThemeMode) => {
    setThemeState(mode);
    try {
      await AsyncStorage.setItem("appTheme", mode);
    } catch (error) {
      console.error("Failed to save theme", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const colors = theme === "light" ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
