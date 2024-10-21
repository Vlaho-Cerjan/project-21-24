import { styled, Box, Button } from '@mui/material';

export const CarouselItemBox = styled(Box)`
width: 100%;
border-radius: 16px;
position: relative;

* {
    border-radius: 16px;
}
`

export const ArrowButton = styled(Button)(({ theme }) => ({
    fontSize: "24px",
    minWidth: "0",
    padding: "8px",
    position: "absolute",
    borderRadius: "22px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    border: "2px solid " + (theme.palette.mode === "dark" ? theme.palette.divider : "transparent"),
    boxShadow: (theme.palette.mode==="dark")?"none !important":"0 2px 4px 0 rgba(0,0,32,0.04) !important",

    [theme.breakpoints.down('lg')]: {
        fontSize: "20px",
        padding: "8px",
    },

    [theme.breakpoints.down('md')]: {
        fontSize: "18px",
        padding: "8px",
    },

    '&:hover': {
        backgroundColor: theme.palette.mode==="dark"?theme.palette.grey[700]:theme.palette.background.paper,

        '& svg': {
            fill: (theme.palette.mode === "dark")?theme.palette.text.secondary+" !important":"rgba(0, 0, 32, 0.76) !important",
        }
    },
}))

export const CarouselContainerBox = styled(Box)(({ theme }) => ({
    padding: "25px 0 40px",

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

export const CarouselContentContainer = styled(Box)(({ theme }) => ({
    padding: "0 40px 25px",
    display: "flex",
    justifyContent: "space-between",

    [theme.breakpoints.down("lg")]: {
        p: "0 30px 25px",
    },

    [theme.breakpoints.down("md")]: {
        p: "0 20px 25px",
    }
}))

export const CarouselTitleContainer = styled(Box)`
display: flex;
`

export const CarouselSliderMenuContainer = styled(Box)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`

export const CarouselSliderButtonContainer = styled(Box)`
    position: absolute;
    top: 20px;
    right: 20px;
`

export const CarouselItemContentContainer = styled(Box)(() => ({
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    maxWidth: "270px",
    padding: "40px",
    zIndex: "1",
    textAlign: "left"
}))

export const CarouselItemTitleContainer = styled(Box)(({theme}) => ({
    lineHeight: "20px",
    marginTop: "10px",
}))

export const CarouselItemDescriptionContainer = styled(Box)(({theme}) => ({
    fontSize: "14px",
    lineHeight: "17px",
    marginTop: "10px",

    '& p': {
        fontSize: "1em",
        lineHeight: "inherit",
        color: "#fff",
    }
}))

