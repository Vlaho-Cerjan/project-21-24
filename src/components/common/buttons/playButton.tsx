import { PlayArrowSharp } from "@mui/icons-material";
import { Button, ButtonProps, styled } from '@mui/material';

export const StyledPlayButton = styled(Button)(({ theme }) => ({
    minWidth: "0",
    width: "44px",
    height: "44px",
    borderRadius: "22px",
    padding: "0",
    margin: "0",
    border: "2px solid rgba(255,255,255,0.32)",
    backgroundColor: theme.palette.text.secondary,
    color: theme.palette.background.paper,
    fontSize: "21px",
    lineHeight: "22px",

    '& svg': {
        fill: theme.palette.background.paper,
        fontSize: "1em",
        lineHeight: "inherit",
        zIndex: 1,
    },

    '&:hover': {
        backgroundColor: theme.palette.background.paper,

        '& svg': {
            fill: theme.palette.text.primary,
        }
    }
}))

export default function PlayButton(buttonProps: ButtonProps) {
    return (
        <StyledPlayButton {...buttonProps}>
            <PlayArrowSharp />
        </StyledPlayButton>
    )
}