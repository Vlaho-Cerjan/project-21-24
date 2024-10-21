import { Box, Paper, styled } from "@mui/material"
import { CoreBg } from "../../../core/coreBackground"

export const MainContainerBox = styled(Box)(({ theme }) => ({
    padding: "0 80px",

    [theme.breakpoints.down('lg')]: {
        padding: "0 40px",
    },

    [theme.breakpoints.down('md')]: {
        padding: "0 20px",
    },

    [theme.breakpoints.down('sm')]: {
        padding: "0 10px",
    }
}))

export const MainBox = styled(CoreBg)(() => ({
    padding: 0,
    borderWidth: "2px",
    position: "relative",
}))