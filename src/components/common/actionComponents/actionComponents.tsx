import { Box, Button, styled } from "@mui/material";
import { CoreBg } from "../../core/coreBackground";

export const ActionPromptContainer = styled(Box)(({ theme }) => ({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: theme.zIndex.drawer,
    justifyContent: "center",
    alignItems: "center",
}))

export const ActionPromptBox = styled(CoreBg)(({ theme }) => ({
    width: "100%",
    maxWidth: "320px",
    zIndex: theme.zIndex.drawer+1,
    textAlign: "center",
    padding: 0,
    height: "auto",
    position: "relative",
}))

export const ActionPromptTitle = styled(Box)(() => ({
    padding: "40px 15px",
}))

export const ActionPromptButton = styled(Button)`
    padding: 22px 0;
    height: 100%;
    border-radius: 0 0 12px 12px;
`
