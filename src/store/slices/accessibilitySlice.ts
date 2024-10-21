import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AccessibilityState {
    fontSize: number
    language: "en" | "es",
    mode: "light" | "dark",
    isDark: boolean,
}

export const initialState: AccessibilityState = {
    fontSize: 10,
    language: 'en',
    mode: 'light',
    isDark: false,
}

const accessibilitySlice = createSlice({
    name: 'accessibility',
    initialState,
    reducers: {
        setFontSize(state, action: PayloadAction<number>) {
            state.fontSize = action.payload;
            localStorage.setItem('accessibility', JSON.stringify(state));
        },
        setLanguage(state, action: PayloadAction<"en" | "es">) {
            state.language = action.payload;
            localStorage.setItem('accessibility', JSON.stringify(state));
        },
        setMode(state, action: PayloadAction<"light" | "dark">) {
            state.mode = action.payload;
            state.isDark = action.payload === "dark";
            localStorage.setItem('accessibility', JSON.stringify(state));
        },
    },
})

export const accessibilityReducer = accessibilitySlice.reducer;

export const { setFontSize, setLanguage, setMode } = accessibilitySlice.actions;