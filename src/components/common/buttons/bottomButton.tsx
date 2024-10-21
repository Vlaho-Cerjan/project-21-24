import React from "react";
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import { StyledActionButton } from "../../project-player/layoutPage/styledComponents/actionsStyledComponents";
import { TextBlack18 } from "../styledText/styledText";

interface Props {
    text: any,
    loading: boolean;
    onClick?: () => void;
    disabled?: boolean;
    color?: "primary" | "success"
}

const BottomButton = ({ text, loading, onClick, disabled, color }: Props) => {
    const { theme } = React.useContext(AccessibilityContext);
    return (
        <StyledActionButton
            color={color}
            disabled={disabled}
            onClick={() => typeof onClick !== "undefined" ? onClick() : undefined}
            loading={loading}
            sx={{
                '&.MuiLoadingButton-loading': {
                    backgroundColor: color === "primary" ? theme.palette.primary.main : color === "success" ? theme.palette.success.main : theme.palette.primary.main,

                    '& svg': {
                        color: color === "primary" ? theme.palette.primary.contrastText : color === "success" ? theme.palette.success.contrastText : theme.palette.primary.contrastText,
                    }
                },
                '& .MuiCircularProgress-root': { width: "24px !important", height: "24px !important" }
            }}
            type="submit"
            variant='contained'>
            <TextBlack18
                containerSx={{
                    lineHeight: "20px"
                }}
                textProps={{
                    sx: {
                        textTransform: "uppercase"
                    }
                }}
                text={text}
            />
        </StyledActionButton>
    )
}

export default BottomButton;