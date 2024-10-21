import { Button, Menu, styled } from "@mui/material";
import React, { useRef } from "react";
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import { CoreBg } from '../../core/coreBackground';
import { IconContainerGrey } from "../iconContainer/iconContainer";
import { StyledMenuItem } from "../menu/styledMenu";
import { TextBold14 } from "../styledText/styledText";

const StyledButton = styled(Button)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    textTransform: "capitalize",
    padding: "10.5px 12px",
    borderRadius: "22px",
    boxShadow: "none !important",
    width: "100%",

    [theme.breakpoints.down('sm')]: {
        width: "100%",
        height: "100%",
        borderRadius: "0",
    }
}))

const StartIconContainer = styled(IconContainerGrey)(() => ({
    display: "inline-flex",
}))

const ButtonTextAndIconContainer = styled(IconContainerGrey)(() => ({
    maxWidth: "180px",
}))

interface DropdownProps {
    buttonId: string;
    startIcon?: React.ReactNode;
    buttonText: React.ReactNode;
    endIcon: React.ReactNode;
    dropdownId: string;
    dropdownMenuItems: {
        function: () => void;
        text: string;
    }[];
    /** Removes all background CSS from Dropdown */
    noBackground? : boolean;
}

const StyledDropdown = ({buttonId, startIcon, buttonText, endIcon, dropdownId, dropdownMenuItems, noBackground}: DropdownProps) => {
    const dropdownButtonRef = useRef<HTMLButtonElement>(null);
    const { theme } = React.useContext(AccessibilityContext);

    const [anchorEl, setAnchorEl] = React.useState<any>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <CoreBg sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "auto", padding: 0, backgroundColor: noBackground ? "transparent !important" : undefined, boxShadow: noBackground ? "none !important" : undefined, borderColor: noBackground ? "transparent !important" : undefined }}>
            <StyledButton
                variant={"text"}
                id={buttonId}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                ref={dropdownButtonRef}
                sx={{
                    width: "auto",
                    paddingRight: "18px",
                    paddingLeft: "18px",
                    borderRadius: "16px",
                    borderColor: theme.palette.text.secondary,

                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                        borderColor: theme.palette.text.secondary,
                    },

                    [theme.breakpoints.down('sm')]: {
                        '.MuiButton-startIcon': {
                            marginRight: 0,
                            marginLeft: 0,
                        }
                    }
                }}
                startIcon={(typeof startIcon === "undefined")?null:
                    <StartIconContainer className="darker" sx={{ fontSize: "24px" }}>
                        {startIcon}
                    </StartIconContainer>
                }
                endIcon={
                    <ButtonTextAndIconContainer className="darker" sx={{ fontSize: "24px" }}>
                        {endIcon}
                    </ButtonTextAndIconContainer>
                }
            >
                <ButtonTextAndIconContainer>
                    <TextBold14
                        text={buttonText?buttonText.toString():""}
                        textProps={{
                            sx: {
                                color: theme.palette.text.secondary,
                            }
                        }}
                    />
                </ButtonTextAndIconContainer>
            </StyledButton>
            <Menu
                id={dropdownId}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        minWidth: "230px",
                    }
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                MenuListProps={{
                'aria-labelledby': buttonId,
                }}
            >
                {
                    dropdownMenuItems.map((item, index) => {
                        return (
                            <StyledMenuItem key={index} onClick={() => item.function()}>
                                <TextBold14
                                    text={item.text}
                                />
                            </StyledMenuItem>
                        )
                    })
                }
            </Menu>
        </CoreBg>
    );
}

export default StyledDropdown;