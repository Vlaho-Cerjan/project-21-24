import { Box, Button, styled, Typography } from "@mui/material";

export const HeaderBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: "25px 40px",
    fontSize: "17px",

    [theme.breakpoints.down('md')]: {
        flexDirection: "column",

        '& > div:first-of-type': {
            marginBottom: "16px"
        }
    },

    [theme.breakpoints.down('sm')]: {
        padding: "16px 24px",
    }
}))

export const HeaderButton = styled(Button)(({ theme }) => ({
    borderRadius: "22px",
    padding: "10px 30px 10px 20px",
    textTransform: "capitalize",
    width: "100%",
    maxWidth: "180px",

    '.MuiButton-startIcon': {
        marginRight: "20px",
    },

    [theme.breakpoints.down('sm')]: {
        maxWidth: "100%",
        width: "auto",
    }
}))

export const HeaderContainer = styled(Box)(({ theme }) => ({
    fontSize: "24px",
    display: "inline-flex",
    flex: "1 1 auto",
    justifyContent: "flex-end",

    [theme.breakpoints.down('md')]: {
        width: "100%",
        justifyContent: "center",
    },

    [theme.breakpoints.down('sm')]: {
        flexWrap: "wrap",
        width: "100%",
    }
}))