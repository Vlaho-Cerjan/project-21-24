import { ThemeProvider } from "@emotion/react";
import { Theme, createTheme } from "@mui/material";
import { createContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import darkThemeOptions from "../../styles/theme/darkThemeOptions";
import lightThemeOptions from "../../styles/theme/lightThemeOptions";
import { AccessibilityState, setFontSize, setLanguage, setMode } from "../slices/accessibilitySlice";
import { fetchEnum } from "../slices/enumSlice";

export const defaultLocale = "en";

const light = createTheme(lightThemeOptions);
const dark = createTheme(darkThemeOptions);

const Themes = {
    light,
    dark,
}

export const AccessibilityContext = createContext<{
    accessibility: AccessibilityState,
    theme: Theme,
}>({
    accessibility: {
        fontSize: 10,
        language: 'en',
        mode: 'light',
        isDark: false,
    },
    theme: light
})


export const AccessibilityProvider = ({ children }: { children: React.ReactNode }) => {
    const { fontSize, language, mode, isDark } = useAppSelector(state => state.accessibility);
    const dispatch = useAppDispatch();
    const [theme, setTheme] = useState<Theme>(Themes[mode]);

    useEffect(() => {
        const storageAcc = localStorage.getItem('accessibility');
        if (storageAcc) {
            const parsedAcc: AccessibilityState = JSON.parse(storageAcc)
            dispatch(setFontSize(parsedAcc.fontSize))
            dispatch(setLanguage(parsedAcc.language))
            dispatch(setMode(parsedAcc.mode))

            if (parsedAcc.mode) {
                setTheme(Themes[parsedAcc.mode]);
            }
        }

        if(dispatch) dispatch(fetchEnum());
    }, [dispatch])

    useEffect(() => {
        if (fontSize) {
            const fontSizeClass = new RegExp(/\bfontSize_.+?\b/, 'g')

            if (document.body.className.match(fontSizeClass)) {
                document.body.className = document.body.className.replace(fontSizeClass, '')
            }
            document.body.classList.add('fontSize_' + fontSize);
        }
    }, [fontSize])

    useEffect(() => {
        if (mode) setTheme(Themes[mode]);

        if (isDark && !document.body.classList.contains("dark")) document.body.classList.add("dark");
        else if (!isDark && document.body.classList.contains("dark")) document.body.classList.remove("dark");
    }, [mode]);

    const contextValue = {
        accessibility: {
            fontSize,
            language,
            mode,
            isDark,
        },
        theme
    }

    return (
        <AccessibilityContext.Provider value={contextValue}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AccessibilityContext.Provider>
    )
}