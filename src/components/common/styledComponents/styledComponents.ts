import { Box, Grid, styled } from "@mui/material";

export const TopContainerBox = styled(Box)(({theme}) => ({
    display: "flex",
    margin: "0 80px",
    position: "relative",

    [theme.breakpoints.down('lg')]: {
        margin: "0 40px",
    },

    [theme.breakpoints.down('md')]: {
        margin: "0 20px",
    },

    [theme.breakpoints.down('sm')]: {
        margin: "0 10px",
    }
}));

export const ItemsContainerBox = styled(Box)(({theme}) => ({
    marginRight: "80px",
    flexGrow: 1,

    [theme.breakpoints.down('lg')]: {
        marginRight: "40px",
    },

    [theme.breakpoints.down('md')]: {
        marginRight: 0,
    },
}))

export const ItemsHeaderBox = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",

    '@media (max-width: 449px)': {
        justifyContent: "center",
    }
}))

export const ItemsFooterBox = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",

    '@media (max-width: 449px)': {
        justifyContent: "center",
    }
}))

export const ItemsHeaderTitleBox = styled(Box)(() => ({
    '@media (max-width: 449px)': {
        margin: "0 16px 0 0",
    }
}))

export const StyledTitleContainer = styled(Box)(() => ({
    marginRight: "10px",
}))

export const VideosHeaderActionBox = styled(Box)(() => ({
    display: "flex",
    alignItems: "center"
}))

export const VideosFooterActionBox = styled(Box)(() => ({
    display: "flex",
    alignItems: "center"
}))

export const FixedFilterBox = styled(Box)(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    transition: "opacity 0.3s ease-in-out",
    zIndex: theme.zIndex.drawer + 1000,
}))

export const StyledGridContainer = styled(Grid)(() => ({
    marginTop: "20px",
    justifyContent: "flex-start",
    marginBottom: "20px",

    '@media (max-width: 449px)': {
        marginLeft: "0 !important",
        width: "100% !important",
        justifyContent: "center !important"
    }

}))

export const StyledGridItem = styled(Grid)(() => ({
    paddingLeft: "15px !important",
    paddingTop: "15px !important",
    minWidth: "216px",
    flexGrow: "1 !important",

    '@media (max-width: 449px)': {
        paddingLeft: "0 !important",
    }
}))

export const StyledSearchContainer = styled(Box)(({theme}) => ({
    borderRadius: "16px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    backgroundColor: theme.palette.background.paper,
}))