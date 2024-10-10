import { ThemeOptions } from "@mui/material";

export const nyumba_dark: ThemeOptions = {
  palette: {
    background: {
      paper: "#323232",
      default: "#262626",
    },
  },
};

export const nyumba_light: ThemeOptions = {
  palette: {
    background: {
      // paper: '#3c3c3c',
      default: "#ffffff",
    },
  },
};

export const nyumba_theme: ThemeOptions = {
  palette: {
    mode: "dark",
    secondary: {
      main: "#FF6600",
      contrastText: "#ffffff",
    },
    success: {
      main: "#00D100",
      contrastText: "#FFF",
    },
    error: {
      main: "#ff0000",
      contrastText: "#FFF",
    },
    warning: {
      main: "#FFA500",
      contrastText: "#FFF",
    },
  },
  spacing: 6,
  typography: {
    fontFamily: "Montserrat",
    fontSize: 15,
    button: {
      textTransform: "none",
    },
  },
};
