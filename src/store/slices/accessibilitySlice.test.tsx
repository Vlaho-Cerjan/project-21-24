import { accessibilityReducer, initialState, setFontSize } from "./accessibilitySlice";
import { it } from 'vitest';

it('returns the initial state', () => {
    expect(accessibilityReducer(undefined, { type: "" })).toEqual(initialState);
});

it('handles setting the font size', () => {
    const fontSize = 20;
    const result = accessibilityReducer(initialState, setFontSize(fontSize));
    expect(result.fontSize).toEqual(fontSize);
});

it('handles setting the language to spanish', () => {
    const language = "es";
    const result = accessibilityReducer(initialState, { type: "accessibility/setLanguage", payload: language });
    expect(result.language).toEqual(language);
});

it('handles setting the mode to dark', () => {
    const mode = "dark";
    const result = accessibilityReducer(initialState, { type: "accessibility/setMode", payload: mode });
    expect(result.mode).toEqual(mode);
    expect(result.isDark).toEqual(true);
});