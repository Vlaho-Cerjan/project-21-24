import { Box, styled } from "@mui/material";

export const DragHandle = styled(Box)(({ theme }) => ({
    padding: "12px",
    width: "100%",
    maxWidth: "100px",
    margin: "0 auto",
    position: "relative",
    top: "-5px",
    cursor: "grab",

    '&:before': {
        content: "''",
        position: "absolute",
        borderRadius: 1,
        borderTop: "2px solid "+((theme.palette.mode==="dark")?theme.palette.grey[400]:"rgba(0,0,32,0.12)"),
        left: "50%",
        width: "100%",
        maxWidth: "64px",
        top: "calc(50% - 3px)",
        transform: "translate(-50%, -50%)"
    },

    '&:after': {
        content: "''",
        position: "absolute",
        borderRadius: 1,
        borderTop: "2px solid "+((theme.palette.mode==="dark")?theme.palette.grey[400]:"rgba(0,0,32,0.12)"),
        left: "50%",
        width: "100%",
        maxWidth: "64px",
        bottom: "calc(50% - 3px)",
        transform: "translate(-50%, -50%)"
    }
}))