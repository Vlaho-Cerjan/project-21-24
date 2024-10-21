import {
    Divider,
    Box,
    styled,
    Theme,
    Backdrop,
    Button,
    Select,
    TextField,
    TextFieldProps,
} from '@mui/material';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import { MaterialUISwitch } from "../../common/switch/themeSwitch";
import { GenericText } from '../../../lang/common/genericText';

import useTranslation from '../../../utility/useTranslation';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { LayoutStrings } from '../../layout/layoutStrings';
import Sticky from 'react-stickynode';
import { IconContainerWhite } from '../../common/iconContainer/iconContainer';
import { TextBold14 } from '../../common/styledText/styledText';
import { StyledMenuItem } from '../../common/menu/styledMenu';
import { TextMedium14 } from '../../common/styledText/styledText';
import { setFontSize, setLanguage, setMode } from '../../../store/slices/accessibilitySlice';
import { useDispatch } from 'react-redux';
import { AccessibilityContext } from '../../../store/providers/accessibilityProvider';

const AccessibilityBox = styled(Box)`
    background-color: ${(props: { theme: Theme }) => props.theme.palette.background.paper};
    z-index: ${(props: { theme: Theme }) => props.theme.zIndex.drawer + 1};
    transition: right 0.5s ease-in-out;
    border-radius: 0 0 0 12px;
`

const SettingButton = styled(Button)`
    min-width: 0;
    border-radius: 0 0 0 4px;
    position: absolute;
    background: ${(props: { theme: Theme }) => props.theme.palette.primary.main};
    box-shadow: none !important;
    &:hover {
        background: ${(props: { theme: Theme }) => props.theme.palette.primary.dark};
    }
`

const AccButonContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 16px 0;
`

const AccItemBox = styled(Box)`
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Accessibility = () => {
    const { t } = useTranslation(LayoutStrings);

    const genericText = useTranslation(GenericText).t;

    const dispatch = useDispatch();

    const { accessibility: { fontSize, language, mode, isDark }, theme } = useContext(AccessibilityContext);

    const StyledFontSizeInput = (props: TextFieldProps) => (
        <TextField
            sx={{ m: "4px 0" }}
            InputProps={{
                sx: {
                    fontSize: "14px",
                }
            }}
            inputProps={{
                style: {
                    maxWidth: "71px",
                    padding: "8px 14px",
                    textAlign: "center",
                    fontSize: "1em",
                    fontWeight: 500
                }
            }}
            {...props}
        />
    )

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };

    const [accBoxWidth, setAccBoxWidth] = useState(0);
    const [accButtonWidth, setAccButtonWidth] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (typeof accessibilityBoxRef !== "undefined" && accessibilityBoxRef.current) setAccBoxWidth(accessibilityBoxRef.current.scrollWidth);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [])

    useEffect(() => {
        if (typeof accessibilityBoxRef !== "undefined" && accessibilityBoxRef.current) setAccBoxWidth(0);
        const timeout = setTimeout(() => {
            if (typeof accessibilityBoxRef !== "undefined" && accessibilityBoxRef.current) setAccBoxWidth(accessibilityBoxRef.current.scrollWidth);
        }, 100);

        return () => clearTimeout(timeout);
    }, [])

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (typeof accessibilityButtonRef !== "undefined" && accessibilityButtonRef.current) setAccButtonWidth(accessibilityButtonRef.current.scrollWidth);
        }, 100);

        return () => clearTimeout(timeout);
    }, [fontSize])

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!open && accessibilityBoxRef.current && !accessibilityBoxRef.current.classList.contains("hidden")) accessibilityBoxRef.current.classList.add("hidden");
        }, 500);

        if (accessibilityBoxRef.current && open && accessibilityBoxRef.current.classList.contains("hidden")) accessibilityBoxRef.current.classList.remove("hidden");

        return () => clearTimeout(timeout);
    }, [open])


    const accessibilityBoxRef = useRef<HTMLDivElement>(null);
    const accessibilityButtonRef = useRef<HTMLButtonElement>(null);

    return (
        <Box
            sx={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: open ? 0 : undefined,
                left: open ? 0 : undefined,
                zIndex: open ? theme.zIndex.drawer + 1400 : 1,

                '@media (min-width: 1441px)': {
                    position: "fixed"
                }
            }}
            className="accessibilityStickyContainer"
        >
            <SettingButton
                onClick={handleToggle}
                ref={accessibilityButtonRef}
                sx={{ left: "-38px" }}
            >
                <IconContainerWhite>
                    <SettingsIcon sx={{ borderRradius: "0 0 0 4px" }} />
                </IconContainerWhite>
            </SettingButton>
            <Box
                sx={{
                    maxWidth: "100%",
                    minWidth: "131px",
                    width: accBoxWidth,
                    position: "absolute",
                    right: open ? 0 : -accBoxWidth - 2,
                    transition: "right 0.5s ease-in-out",
                    backgroundColor: theme.palette.background.paper,
                    zIndex: open ? theme.zIndex.drawer + 1501 : theme.zIndex.drawer + 1,
                    borderRadius: "0 0 0 12px",
                }}
            >
                <Sticky
                    top={0}
                >
                    <AccessibilityBox
                        ref={accessibilityBoxRef}
                        sx={{
                            '&.hidden': {
                                visibility: "hidden",
                                opacity: 0,
                                height: 0,
                            }
                        }}
                    >
                        <SettingButton
                            onClick={handleToggle}
                            ref={accessibilityButtonRef}
                            sx={{ left: "-38px" }}
                        >
                            <IconContainerWhite>
                                <SettingsIcon sx={{ borderRradius: "0 0 0 4px" }} />
                            </IconContainerWhite>
                        </SettingButton>
                        <AccButonContainer>
                            <AccItemBox>
                                <TextBold14
                                    text={t("setMode")}
                                />
                                <MaterialUISwitch
                                    sx={{ m: "8px 0" }}
                                    checked={isDark}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                    onClick={() => {
                                        dispatch(setMode(isDark ? "light" : "dark"));
                                    }}
                                />
                            </AccItemBox>
                            <Divider flexItem sx={{ borderBottomWidth: "2px", m: "8px 0" }} />
                            <AccItemBox>
                                <TextBold14
                                    text={t("setLanguage")}
                                />
                                <Select
                                    value={language || "en"}
                                    sx={{ m: "8px 0" }}
                                    SelectDisplayProps={{
                                        style: { paddingTop: "8px", paddingBottom: "8px", backgroundColor: theme.palette.background.default }
                                    }}
                                    onChange={(e) => dispatch(setLanguage(e.target.value as "en" | "es"))}
                                >
                                    <StyledMenuItem value="en">
                                        <TextMedium14
                                            text={genericText("english")}
                                            textProps={{
                                                sx: {
                                                    color: theme.palette.text.primary,
                                                }
                                            }}
                                        />
                                    </StyledMenuItem>
                                    <StyledMenuItem value="es">
                                        <TextMedium14
                                            text={genericText("spanish")}
                                            textProps={{
                                                sx: {
                                                    color: theme.palette.text.primary,
                                                }
                                            }}
                                        />
                                    </StyledMenuItem>
                                </Select>
                            </AccItemBox>
                            <Divider flexItem sx={{ borderBottomWidth: "2px", m: "8px 0" }} />
                            <AccItemBox>
                                <TextBold14
                                    text={t("setFontSize")}
                                />
                                <Box sx={{ display: "flex", mt: "4px", flexDirection: "column", alignItems: "center" }}>
                                    <Button
                                        onClick={() => dispatch(setFontSize(fontSize - 1))}
                                        fullWidth
                                        variant="contained"
                                        disabled={(fontSize) ? fontSize === 10 : true}
                                    >
                                        <IconContainerWhite>
                                            <RemoveRoundedIcon />
                                        </IconContainerWhite>
                                    </Button>
                                    <StyledFontSizeInput
                                        aria-readonly="true"
                                        disabled
                                        value={(fontSize / 10) + 'x'}
                                    />
                                    <Button
                                        onClick={() => dispatch(setFontSize(fontSize + 1))}
                                        fullWidth
                                        variant="contained"
                                        disabled={(fontSize) ? fontSize === 14 : true}
                                    >
                                        <IconContainerWhite>
                                            <AddRoundedIcon />
                                        </IconContainerWhite>
                                    </Button>
                                </Box>
                            </AccItemBox>
                        </AccButonContainer>
                    </AccessibilityBox>
                </Sticky>
            </Box>
            <Backdrop
                sx={{ position: "absolute", zIndex: (theme: Theme) => open ? theme.zIndex.drawer + 1500 : theme.zIndex.drawer, backgroundColor: isDark ? "rgba(255,255,255,0.2)" : undefined }}
                open={open}
                onClick={handleClose}
            />
        </Box>
    )
}

export default Accessibility;