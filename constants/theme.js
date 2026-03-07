//constants/theme.js
import { Platform } from "react-native";

/*
|--------------------------------------------------------------------------
| Color Tokens (Design System)
|--------------------------------------------------------------------------
*/

export const Colors = {
  light: {
    /* Core */
    primary: "#6366F1",
    background: "#F8FAFC",
    surface: "#FFFFFF",

    /* Text */
    textMain: "#0F172A",
    textSecondary: "#64748B",

    /* UI */
    border: "#E2E8F0",
    divider: "#E5E7EB",

    /* Status */
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",

    /* Timeline */
    timelineLine: "#E5E7EB",

    /* Shadows */
    shadow: "#000000",

    /* Icon */
    icon: "#687076",

    white: "#FFFFFF",
  },

  dark: {
    primary: "#6366F1",
    background: "#11141a",
    surface: "#1E293B",

    textMain: "#ffffff",
    textSecondary: "#94A3B8",

    border: "#334155",
    divider: "#334155",

    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",

    timelineLine: "#334155",

    shadow: "#000000",

    icon: "#9BA1A6",

    white: "#FFFFFF",
  },
};

/*
|--------------------------------------------------------------------------
| Spacing Scale
|--------------------------------------------------------------------------
*/

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

/*
|--------------------------------------------------------------------------
| Radius
|--------------------------------------------------------------------------
*/

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

/*
|--------------------------------------------------------------------------
| Shadows
|--------------------------------------------------------------------------
*/

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
};

/*
|--------------------------------------------------------------------------
| Fonts
|--------------------------------------------------------------------------
*/

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded','Hiragino Maru Gothic ProN',Meiryo,'MS PGothic'",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas",
  },
});
