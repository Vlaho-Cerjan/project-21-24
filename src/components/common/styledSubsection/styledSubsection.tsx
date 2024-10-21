import { Box, styled, SxProps } from "@mui/material";
import { TextBold14 } from '../styledText/styledText';
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import React from "react";

interface StyledSubsectionProps {
    title: React.ReactElement | string;
    children: React.ReactNode;
    containerSx?: SxProps;
    rightContainer?: React.ReactNode;
}

const StyledSubsectionContainer = styled(Box)(({theme}) => ({
    display: "flex",
    width: "100%",
    minWidth: "230px",
    flexDirection: "column",
    borderRadius: "8px",
    border: theme.palette.mode==="dark"?"2px solid "+theme.palette.grey[800]:"2px solid rgba(0,0,32,0.04)"
}))

const StyledSubsectionChildContainer = styled(Box)(({ theme }) => ({
    minHeight: "64px",
    padding: "0",
    borderRadius: "0 0 8px 8px",
    backgroundColor: theme.palette.background.paper
}))

const StyledSubsection = ({ title, children, containerSx, rightContainer}: StyledSubsectionProps) => {
    const { theme } = React.useContext(AccessibilityContext);

    return (
        <StyledSubsectionContainer>
            <Box sx={{
                display: "flex",
                minHeight: "60px",
                padding: "8px 14px 8px 0",
                borderRadius: "5px 5px 0 0",
                backgroundColor: theme.palette.mode==="dark"?theme.palette.background.default:"#F8F8FA",
                borderBottom: theme.palette.mode==="dark"?"2px solid "+theme.palette.grey[800]:"2px solid #F3F3F4",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <TextBold14
                    text={title}
                    textComponent="h3"
                    textProps={{
                        sx: {
                            padding: "0 25px"
                        }
                    }}
                />
                {
                    (typeof rightContainer !== "undefined") ?
                        rightContainer
                        : null
                }
            </Box>
            <StyledSubsectionChildContainer sx={containerSx}>
                {children}
            </StyledSubsectionChildContainer>
        </StyledSubsectionContainer>
    )
}

export default StyledSubsection;