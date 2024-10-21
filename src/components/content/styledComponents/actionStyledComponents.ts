import { TabList } from "@mui/lab";
import { Box, styled, Tab } from "@mui/material";
import { CoreBg } from "../../core/coreBackground";

export const StyledActionContainer = styled(CoreBg)(({theme}) => ({
    padding: 0,
    width: "auto",
    margin: "0 80px",

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

export const StyledSubsectionContainer = styled(Box)(({theme}) => ({
    padding: "20px 40px",

    [theme.breakpoints.down('lg')]: {
        padding: "15px 30px",
    },

    [theme.breakpoints.down('md')]: {
        padding: "10px 20px",
    },

    [theme.breakpoints.down('sm')]: {
        padding: "5px 10px",
    },

    '&.columnLeft': {
        padding: "20px 20px 20px 40px",

        [theme.breakpoints.down('lg')]: {
            padding: "15px 15px 15px 30px",
        },

        [theme.breakpoints.down('md')]: {
            padding: "10px 20px",
        },
    
        [theme.breakpoints.down('sm')]: {
            padding: "5px 10px",
        },
    },

    '&.columnRight': {
        padding: "20px 40px 20px 20px",

        [theme.breakpoints.down('lg')]: {
            padding: "15px 30px 15px 15px",
        },

        [theme.breakpoints.down('md')]: {
            padding: "10px 20px",
        },
    
        [theme.breakpoints.down('sm')]: {
            padding: "5px 10px",
        },
    },

    '&.columnCenter': {
        padding: "20px",

        [theme.breakpoints.down('lg')]: {
            padding: "15px",
        },

        [theme.breakpoints.down('md')]: {
            padding: "10px",
        },

        [theme.breakpoints.down('sm')]: {
            padding: "5px",
        }
    },

    '&:first-of-type': {
        paddingTop: "40px",

        [theme.breakpoints.down('lg')]: {
            paddingTop: "30px",
        },

        [theme.breakpoints.down('md')]: {
            paddingTop: "20px",
        },

        [theme.breakpoints.down('sm')]: {
            paddingTop: "10px",
        }
    },

    '&:last-of-type': {
        paddingBottom: "40px",

        [theme.breakpoints.down('lg')]: {
            paddingBottom: "30px",
        },

        [theme.breakpoints.down('md')]: {
            paddingBottom: "20px",
        },

        [theme.breakpoints.down('sm')]: {
            paddingBottom: "10px",
        }
    },
}));

export const StyledTabListContainer = styled(Box)(() => ({
    position: "absolute",
    top: "-30px",
    right: 17,
}))

export const StyledTabList = styled(TabList)(({theme}) => ({
    minHeight: "30px",
    display: "inline-block",
    borderRadius: "4px 4px 0 0",
    fontSize: "12px",

    '& .MuiTab-root.Mui-selected': {
        color: theme.palette.text.primary,
    },

    '& .MuiTabs-indicator': {
        display: "none"
    }
}));

export const StyledTabListItem = styled(Tab)(({theme}) => ({
    border: "2px solid "+((theme.palette.mode === "dark")?theme.palette.grey[800]:"rgba(0,0,32,0.04)"),
    borderBottom: "none",
    minWidth: "48px",
    minHeight: "30px",
    padding: "4px",
    
    '&:not(:first-of-type):not(:last-of-type)': {
        borderRightWidth: "1px",
        borderLeftWidth: "1px",
    },

    '&:first-of-type': {
        borderRightWidth: "1px",
        borderRadius: "4px 0 0 0",
    },

    '&:last-of-type': {
        borderLeftWidth: "1px",
        borderRadius: "0 4px 0 0",
    },

    '&.Mui-selected': {
        backgroundColor: theme.palette.background.paper,
        borderColor: ((theme.palette.mode === "dark")?theme.palette.grey[800]:"rgba(0,0,32,0.06)"),
    },
}))