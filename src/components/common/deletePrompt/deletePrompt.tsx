import { Box, Backdrop } from "@mui/material";
import { ActionPromptButton } from "../actionComponents/actionComponents";
import { TextBlack18, TextMedium16 } from "../styledText/styledText";
import { StyledTitle } from "../styledTitle/styledTitle";
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import React from "react";
import useTranslation from '../../../utility/useTranslation';
import { GenericText } from '../../../lang/common/genericText';
import { CoreBg } from "../../core/coreBackground";

interface DeletePromptProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    title?: string;
    text?: React.ReactElement | string;
    confirmFunction: (id: string) => void;
    cancelFunction: () => void;
    id: string;
}

const DeletePrompt = ({
    open,
    setOpen,
    title,
    text,
    confirmFunction,
    cancelFunction,
    id
}: DeletePromptProps ) => {
    const { theme } = React.useContext(AccessibilityContext);
    const genericText = useTranslation(GenericText).t;

    return (
        <Box>
            <CoreBg
                sx={{
                    zIndex: open ? theme.zIndex.drawer + 1001 : -1,
                    visibility: open ? "visible" : "hidden",
                    opacity: open ? 1 : 0,
                    transition: "all 0.3s ease-in-out",
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    width: "auto",
                    transform: "translate(-50%, -50%)",
                    height: "auto"
                }}
            >
                <StyledTitle
                    sx={{ textTransform: "uppercase" }}
                    title={!title ? genericText("deleteWarning") : title}
                />
                {text ?
                <TextMedium16
                    text={text}
                />
                : null}
                <Box sx={{ display: "flex" }}>
                    <ActionPromptButton
                        variant="contained"
                        sx={{
                            borderRadius: "12px 0 0 12px"
                        }}
                        fullWidth
                        onClick={() => confirmFunction(id)}
                    >
                        <TextBlack18 textProps={{
                            sx: {
                                textTransform: "uppercase"
                            }
                        }} text={genericText("confirm")} />
                    </ActionPromptButton>
                    <ActionPromptButton
                        variant="contained"
                        color="error"
                        sx={{
                            borderRadius: "0 12px 12px 0"
                        }}
                        fullWidth
                        onClick={cancelFunction}
                    >
                        <TextBlack18 textProps={{
                            sx: {
                                textTransform: "uppercase"
                            }
                        }} text={genericText("cancel")} />
                    </ActionPromptButton>
                </Box>
            </CoreBg>
            <Backdrop open={open} onClick={() => setOpen(false)} sx={{ zIndex: open ? theme.zIndex.drawer + 1000 : 0, }} />
        </Box>
    )
}

export default DeletePrompt;