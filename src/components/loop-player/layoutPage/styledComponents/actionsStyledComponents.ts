import { LoadingButton } from "@mui/lab"
import { Backdrop, Box, FormLabel, styled } from "@mui/material"
import { CoreBg } from "../../../core/coreBackground"

export const ActionItemOverlayContainer = styled(Backdrop)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 100,
}))

export const ActionItemContainer = styled(Box)(({ theme }) => ({
    transition: "opacity 0.5s ease-in-out, visibility 0.5s ease-in-out",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: theme.zIndex.drawer + 100,
    overflowY: "auto",
}))


export const StyledActionButton = styled(LoadingButton)`
    border-radius: 0 0 12px 12px;
    padding: 23px 0;
    width: calc(100% + 54px);
    margin-left: -27px;
    margin-right: -27px;
    bottom: -2px;
`

export const StyledActionContentBox = styled(CoreBg)(({ theme }) => ({
    width: "100%",
    maxWidth: "625px",
    height: "auto",
    padding: "0 25px",
    zIndex: theme.zIndex.drawer + 101,
    position: "relative",
    top: "0",
    left: "50%",
    transform: "translate(-50%, 0%)",
    margin: "100px 0",
    border: "2px solid "+(theme.palette.mode==="dark"?theme.palette.grey[800]:theme.palette.grey[400]),
}))

export const ItemsContainer = styled(Box)(({ theme }) => ({
    height: "304px",
    overflowY: "auto",
    overflowX: "hidden",
    padding: "0",
    borderRadius: "10px",
    marginTop: "18px",
    marginBottom: "40px",
    border: (theme.palette.mode==="dark")?"2px solid "+theme.palette.background.default:"2px solid rgba(0,0,32,0.08)",

    '& > button': {
        backgroundColor: theme.palette.background.paper+ " !important",
        cursor: "pointer",

        '&:hover': {
            backgroundColor: theme.palette.grey[200]+ " !important",
        },

        '&:nth-of-type(even)': {
            backgroundColor: theme.palette.background.default+ " !important",

            '&:hover': {
                backgroundColor: theme.palette.grey[200]+ " !important",
            },
        }
    }
}))

export const UploadFileContainer = styled(Box)(() => ({
    fontSize: "12px",
    lineHeight: "20px"
}))

export const UploadFileFormLabel = styled(FormLabel)(() => ({
    display: "flex",
    padding: "14px 25px",
    fontSize: "1em",
    fontWeight: 900,
    lineHeight: "inherit"
}))
