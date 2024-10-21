import { CheckCircleOutlineRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Fade, styled } from '@mui/material';
import React from "react";
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import { TextBlack18 } from "../../common/styledText/styledText";
import { CoreBg } from "../../core/coreBackground";

const StyledAuthLoadingButton = styled(LoadingButton)`
width: calc(100% + 34px);
margin-left: -17px;
margin-bottom: -16px;
line-height: 20px;
padding: 22px 0;
border-radius: 0 0 16px 16px;

&.success {
    padding: 6.5px 0;
}

& svg {
    font-size: 53px;
}
`

export const StyledAuthBoxContainer = styled(CoreBg)`
    padding: 0 15px;
    max-width: 320px;
    height: auto;
    text-align: center;
    background-color: #fff !important;

    h1 {
        color: #333 !important;
    }

    p, a, span {
        color: rgba(0,0,0,0.6);
    }

    form > button {
        background-color: #288CF0;
        span {
            color: #fff;
        }
        svg {
            color: #fff;
        }
    }

    .MuiInputBase-root {
        background-color: transparent;

        fieldset {
            border-color: rgba(0,0,0,0.2);
        }

        :hover {
            fieldset {
                border-color: rgba(0,0,0,0.2);
            }
        }

        &.Mui-focused fieldset {
            border-color: #288CF0 !important;
        }

        input {
            box-shadow: none !important;
            text-fill-color: #333 !important;
            caret-color: #333 !important;
            color: #333;
            background-color: transparent;
        }
        
        button {
            svg {
                color: rgba(0, 0, 0, 0.54);
            }
            background-color: transparent;
        }
    }
`

interface StyledAuthButtonProps {
    success: boolean;
    loading: boolean;
    buttonText: string;
}

export const StyledAuthButton = ({ success, loading, buttonText }: StyledAuthButtonProps) => {
    const { theme } = React.useContext(AccessibilityContext);

    return (
        <StyledAuthLoadingButton
            className={success ? "success" : undefined}
            loading={loading}
            sx={{

                padding: loading ? "32px 0" : undefined,
                backgroundColor: success ? theme.palette.success.main + " !important" : loading ? theme.palette.grey[600] + " !important" : theme.palette.primary.dark + " !important",
                '&:hover': { backgroundColor: success ? theme.palette.success.main + " !important" : loading ? theme.palette.grey[600] + " !important" : undefined },
                '& .MuiCircularProgress-root': {
                    width: "32px !important",
                    height: "32px !important",
                }
            }}
            type="submit"
            variant="contained"
        >
            {success ?
                <Fade in={success}><CheckCircleOutlineRounded fontSize="large" /></Fade>
                :
                <TextBlack18
                    text={loading ? "" : buttonText}
                />
            }
        </StyledAuthLoadingButton>
    )
}