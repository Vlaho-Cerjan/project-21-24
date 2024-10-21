import { Box, styled } from "@mui/material";

export const RowBgGray = styled(Box)(({ theme }) => ({
    backgroundColor: (theme.palette.mode !== "dark") ? "rgba(0, 0, 32, 0.08)" : "rgba(255, 255, 255, 0.08)",
}))

export const RowBgWhite = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}))

export const RowBgLightGray = styled(Box)(({ theme }) => ({
    backgroundColor: (theme.palette.mode !== "dark") ? "rgba(0, 0, 32, 0.04)" : "rgba(255, 255, 255, 0.04)",
}))