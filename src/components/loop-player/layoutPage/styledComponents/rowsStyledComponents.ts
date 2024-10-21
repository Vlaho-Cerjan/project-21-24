import { Box, Button, styled } from "@mui/material";

export const LayoutButton = styled(Button)(({ theme }) => ({
    borderRadius: "22px",
    padding: "10px 20px",
    textTransform: "uppercase",

    '.MuiButton-startIcon': {
        marginRight: "20px",
    },

    [theme.breakpoints.down('sm')]: {
        maxWidth: "100%",
        width: "auto",
    }
}))

export const ItemContainerBox = styled(Box)(({ theme }) => ({
    padding: "25px 0",

    '& div.swiper': {
        padding: "0 40px",

        [theme.breakpoints.down("lg")]: {
            padding: "0 30px"
        },

        [theme.breakpoints.down("md")]: {
            padding: "0 20px"
        }
    }
}))

export const ContentBox = styled(Box)(({ theme }) => ({
    padding: "0 40px 20px",
    display: "flex",
    justifyContent: "space-between",

    [theme.breakpoints.down("lg")]: {
        padding: "0 30px 15px",
    },

    [theme.breakpoints.down("md")]: {
        padding: "0 20px 15px",
    }
}))

export const ContentBoxTitleContainer = styled(Box)`
    display: flex;
`

export const AddRowContainer = styled(Box)(({ theme }) => ({
    width: "100%",
    textAlign: "right",
    padding: "20px 40px",

    [theme.breakpoints.down("lg")]: {
        padding: "20px 30px"
    },

    [theme.breakpoints.down("md")]: {
        padding: "15px 20px"
    }
}))

export const SliderItemBox = styled(Box)`
    width: 100%;
    border-radius: 16px;
    position: relative;

    * {
        border-radius: 16px;
    }
`