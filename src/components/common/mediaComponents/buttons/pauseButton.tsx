import { PauseSharp, PlayArrowSharp } from "@mui/icons-material";
import { Button, styled, ButtonProps } from '@mui/material';

export const StyledPauseButton = styled(Button)(({ theme }) => ({
    minWidth: "0",
    width: "62px",
    height: "62px",
    borderRadius: "31px",
    padding: "0",
    margin: "0",
    boxShadow: "0 1px 6px 0 rgba(40,140,240,0.24)",
    backgroundColor: theme.palette.primary.main,
    fontSize: "24px",
    lineHeight: "26px",

    '& svg': {
        fill: theme.palette.background.paper,
        fontSize: "1em",
        lineHeight: "inherit"
    },

    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    }
}))

interface PauseButtonProps extends ButtonProps {
    isPlaying: boolean;
}

export default function PauseButton(buttonProps: PauseButtonProps) {
    return (
        <StyledPauseButton
            {...buttonProps}
        >
            {
                buttonProps.isPlaying ? <PauseSharp /> : <PlayArrowSharp />
            }
        </StyledPauseButton>
    )
}