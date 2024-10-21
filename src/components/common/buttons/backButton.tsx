import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Button, ButtonProps, SxProps, Theme, styled } from '@mui/material';
import router from "next/router";
import { IconContainerGrey } from "../iconContainer/iconContainer";

const StyledButton = styled(Button)(({ theme }) => ({
    minWidth: "auto",
    padding: "4px",
    marginRight: "15px",
    fontSize: "24px",
    borderRadius: "4px",
    boxShadow: "0 2px 4px 0 rgba(0,0,32,0.12) !important",

    backgroundColor: theme.palette.mode==="dark"?theme.palette.grey[800]:theme.palette.background.paper,
    '&:hover': {
        backgroundColor: theme.palette.mode==="dark"?theme.palette.grey[700]:theme.palette.background.default,
    },
}))

interface BackButtonProps {
    buttonProps?: ButtonProps,
    iconSx?: SxProps<Theme>,
}

const BackButton = ({ buttonProps, iconSx }: BackButtonProps) => {

    return (
        <StyledButton
            variant="contained"
            onClick={router.back}
            {...buttonProps}
        >
            <IconContainerGrey
                className="darker"
                sx={{
                    fontSize: "24px",
                    ...iconSx
                }}
            >
                <KeyboardArrowLeftRounded />
            </IconContainerGrey>
        </StyledButton>
    )
}

export default BackButton;