import { SaveOutlined } from "@mui/icons-material";
import { Button, styled } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { AccessibilityContext } from "../../../../store/providers/accessibilityProvider";
import useTranslation from '../../../../utility/useTranslation';
import BackButton from '../../../common/buttons/backButton';
import { IconContainerWhite } from "../../../common/iconContainer/iconContainer";
import { TextBold14, TextBold20 } from '../../../common/styledText/styledText';
import { HeaderBox, HeaderButton, HeaderContainer } from "../../../project-player/layoutPage/styledComponents/headerStyledComponents";
import { ActionVideoStrings } from "../lang/actionVideoStrings";

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

interface ActionVideoHeaderProps {
    handleSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void,
    action: "edit" | "add",
}

const ActionVideoHeader = ({action, handleSubmit}: ActionVideoHeaderProps) => {
    const { theme } = React.useContext(AccessibilityContext);
    const { t } = useTranslation(ActionVideoStrings);

    const router = useRouter();

    return (
        <HeaderBox sx={{
            [theme.breakpoints.down('md')]: {
                flexDirection: "row",
                '& > div:first-of-type': {
                    marginBottom: "0"
                }
            },

            [theme.breakpoints.down('sm')]: {
                padding: "16px 24px",
            }
        }}>
            <BackButton />
            <TextBold20
                text={action==="edit"?t("editVideo"):t("createVideo")}
                textComponent="h2"
                containerSx={{
                    lineHeight: "24px",
                    flexGrow: 1
                }}
            />
            <HeaderContainer sx={{
                [theme.breakpoints.down('md')]: {
                    width: "auto",
                    justifyContent: "flex-end",
                },
            }}>
                <HeaderButton
                    onClick={handleSubmit}
                    variant="contained"
                    color="info"
                    sx={{
                        [theme.breakpoints.down('md')]: {
                            flexGrow: 1,
                        },

                        '@media (max-width: 420px)': {
                            width: "100%",
                            ml: "0",
                        }
                    }}
                    startIcon={
                        <IconContainerWhite>
                            <SaveOutlined />
                        </IconContainerWhite>
                    }
                >
                    <TextBold14
                        text={action==="edit"?t("updateVideo"):t("createVideo")}
                        textProps={{
                            sx: {
                                color: "primary.contrastText",
                            }
                        }}
                    />
                </HeaderButton>
            </HeaderContainer>
        </HeaderBox>
    )
}

export default ActionVideoHeader;