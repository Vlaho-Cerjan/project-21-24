import { ChevronRightRounded } from "@mui/icons-material";
import { Box, Button, SvgIconTypeMap, styled } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React from "react";
import { NavigationStrings } from "../../../lang/common/constants/navigation";
import { AccessibilityContext } from '../../../store/providers/accessibilityProvider';
import useTranslation from "../../../utility/useTranslation";
import { IconContainerGrey } from "../iconContainer/iconContainer";
import Link from "../navigation/Link";
import { TextBold14 } from "../styledText/styledText";

const StyledNavChildBox = styled(Box)(({ theme }) => ({
    width: "100%",
    display: "flex",
    alignItems: "center",

    '& svg:hover': {
        color: (theme.palette.mode === "dark") ? theme.palette.text.secondary + " !important" : "rgba(0, 0, 32, 0.48) !important",
        fill: (theme.palette.mode === "dark") ? theme.palette.text.secondary + " !important" : "rgba(0, 0, 32, 0.48) !important",
    },

    '&.MuiBox-root, &.MuiButton-root, &.MuiLink-root': {

        '&.active': {
            '& svg,& p,& span': {
                color: theme.palette.primary.contrastText + " !important",
                fill: theme.palette.primary.contrastText + " !important",

                '&:hover': {
                    color: theme.palette.primary.contrastText + " !important",
                    fill: theme.palette.primary.contrastText + " !important",
                }
            },
        },
    },
}))

const StyledLink = styled(Link)`
    padding: 10px 17px 10px 25px !important;
    min-width: 230px !important;
`

interface NavProps {
    child: {
        title: string;
        icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
            muiName: string;
        };
        href: string;
        disabled: boolean;
    },
    isActive: boolean,
    index: number,
    childIndex: number,
    square?: boolean
}

const NavButton = ({ child, isActive, index, childIndex, square }: NavProps ) => {
    const { t } = useTranslation(NavigationStrings);
    const { theme } = React.useContext(AccessibilityContext);

    return (
        <Button
            id={child.href}
            disabled={child.disabled}
            variant={(isActive) ? "contained" : (child.disabled) ? "contained" : "text"}
            sx={{
                boxShadow: "none !important",
                mb: "2px",
                '&:hover': {
                    boxShadow: "none !important",
                },

                '&.MuiLink-root': {
                    borderRadius: square ? "0px" : undefined,
                },

                '&.MuiLink-root.Mui-disabled': {
                    background: "transparent !important",

                    '& p.MuiTypography-root, & span.MuiTypography-root, & svg.MuiSvgIcon-root': {
                        color: theme.palette.text.secondary + " !important",
                        fill: theme.palette.text.secondary + " !important",
                    },

                    '&.active': {
                        '& p.MuiTypography-root, & span.MuiTypography-root, & svg.MuiSvgIcon-root': {
                            color: theme.palette.text.secondary + " !important",
                            fill: theme.palette.text.secondary + " !important",
                        }
                    }
                }
            }}
            LinkComponent={StyledLink}
            href={child.href}
            key={"childItem_" + index.toString() + "_" + childIndex.toString()}>
            <StyledNavChildBox className={isActive ? "active" : undefined}>
                <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                    <child.icon sx={{ mr: "16px" }} />
                </IconContainerGrey>
                <TextBold14
                    text={t(child.title)}
                    containerSx={{
                        lineHeight: "20px",
                    }}
                    textProps={{
                        sx: {
                            color: "text.secondary",
                            textTransform: "capitalize"
                        }
                    }}
                />
                <IconContainerGrey className="darker" sx={{ fontSize: "24px", ml: "auto", float: "right", }}>
                    <ChevronRightRounded sx={{ lineHeight: "20px" }} />
                </IconContainerGrey>
            </StyledNavChildBox>
        </Button>
    )
}

export default NavButton;