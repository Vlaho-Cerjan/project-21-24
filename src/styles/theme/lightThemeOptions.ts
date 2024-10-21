import { ThemeOptions } from '@mui/material/styles';

const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    text: {
      primary: "rgba(0,0,32,0.76)",
      secondary: "rgba(0,0,32,0.48)"
    },
    primary: {
      main: "#288CF0",
      dark: "#2B7AE2",
    },
    success: {
      main: "#8CD228",
      dark: "#7CB822",
      contrastText: "#fff"
    },
    error: {
      main: "#EE5A5A"
    },
    background: {
      default: "#f8f8fa"
    },
    divider: "rgba(0,0,32,0.04)",
  },
  shape: {
    borderRadius: 12,
  },
};

export default lightThemeOptions;