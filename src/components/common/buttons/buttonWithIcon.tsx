import { Box, Button, SxProps, Theme, styled } from "@mui/material";
import React from "react";
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import { IconContainerWhite } from '../iconContainer/iconContainer';
import Link from "../navigation/Link";
import { TextBold14 } from '../styledText/styledText';

const StyledButton = styled(Button)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    textTransform: "capitalize",
    padding: "10px 42px 10px 22px",
    borderRadius: "22px",
    width: "100%",
    height: "100%"
}))

interface DropdownProps {
    startIcon: any;
    buttonText: string;
    buttonFunction?: () => void;
    buttonHref?: string;
    buttonColor?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" | "grey",
    containerSx?: SxProps<Theme>,
    buttonSx?: SxProps<Theme>,
}

const ButtonWithIcon = ({ startIcon, buttonText, buttonFunction, buttonHref, buttonColor, containerSx, buttonSx }: DropdownProps) => {
    const { theme } = React.useContext(AccessibilityContext);

    return (
        <Box
            sx={
                containerSx ?
                    {  height: "inherit", padding: 0, display: "inline-block", borderRadius: "22px", ...containerSx }
                    :
                    { height: "inherit", padding: 0, display: "inline-block", borderRadius: "22px" }
            }
        >
            <StyledButton
                color={buttonColor !== "grey" && buttonColor ? buttonColor : undefined}
                sx={
                    buttonSx ? {
                        borderRadius: "22px",

                        '& .MuiButton-startIcon': {
                            marginRight: "20px",
                        },

                        backgroundColor: buttonColor === "grey" ? theme.palette.text.secondary : undefined,
                        color: buttonColor === "grey" ? "#FFF" : undefined,
                        boxShadow: buttonColor === "grey" ? "0 1px 6px 0 rgba(0, 0, 32, 0.32) !important" : undefined,

                        '&:hover': {
                            backgroundColor: buttonColor === "grey" ? "rgba(0,0,32,0.58)" : undefined,
                            color: buttonColor === "grey" ? "#FFF" : undefined,
                            boxShadow: buttonColor === "grey" ? "0 1px 6px 0 rgba(0, 0, 32, 0.32) !important" : undefined,
                        },
                        ...buttonSx,
                    }
                        : {
                            borderRadius: "22px",

                            '& .MuiButton-startIcon': {
                                marginRight: "20px",
                            },

                            backgroundColor: buttonColor === "grey" ? theme.palette.text.secondary : undefined,
                            color: buttonColor === "grey" ? "#FFF" : undefined,
                            boxShadow: buttonColor === "grey" ? "0 1px 6px 0 rgba(0, 0, 32, 0.32) !important" : undefined,

                            '&:hover': {
                                backgroundColor: buttonColor === "grey" ? "rgba(0,0,32,0.58)" : undefined,
                                color: buttonColor === "grey" ? "#FFF" : undefined,
                                boxShadow: buttonColor === "grey" ? "0 1px 6px 0 rgba(0, 0, 32, 0.32) !important" : undefined,
                            },
                        }
                }
                variant="contained"
                onClick={buttonFunction}
                href={buttonHref}
                LinkComponent={Link}
                startIcon={
                    <IconContainerWhite
                        sx={{
                            fontSize: "24px !important",

                            '& svg': {
                                fill:
                                    (buttonColor === "inherit" ? "inherit" :
                                        buttonColor === "primary" ? theme.palette.primary.contrastText :
                                            buttonColor === "secondary" ? theme.palette.secondary.contrastText :
                                                buttonColor === "success" ? theme.palette.success.contrastText :
                                                    buttonColor === "error" ? theme.palette.error.contrastText :
                                                        buttonColor === "info" ? theme.palette.info.contrastText :
                                                            buttonColor === "warning" ? theme.palette.warning.contrastText :
                                                                buttonColor === "grey" ? "#fff" :
                                                                    theme.palette.primary.contrastText) + " !important",
                            },
                        }}
                    >
                        {startIcon}
                    </IconContainerWhite>
                }
            >
                <TextBold14
                    text={buttonText}
                    containerSx={{ lineHeight: "16px" }}
                />
            </StyledButton>
        </Box>
    );
}

export default ButtonWithIcon;