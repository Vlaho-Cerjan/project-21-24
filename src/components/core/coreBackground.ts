import { Box, styled } from "@mui/material";

export const CoreBg = styled(Box)(({ theme }) => ({
    height: "inherit",
    width: "100%",
    borderRadius: "22px",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.palette.mode === "dark" ? "none" : "0 2px 4px 0 rgba(0, 0, 32, 0.04)",
    border: theme.palette.mode === "dark" ? "2px solid transparent" : "none",

    '&:hover': {
        boxShadow: theme.palette.mode === "dark" ? "none" : "0 4px 16px 0 rgba(0, 0, 32, 0.24)",
        border: theme.palette.mode === "dark" ? "2px solid rgba(255, 255, 255, 0.16)" : "none",
    },

    '&.inactive, &.disabled': {
        boxShadow: "none",
        border: "none",
        background: "none",
    }
}));