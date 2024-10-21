// accessibility provider test

import React from "react";
import { AccessibilityContext } from "./accessibilityProvider";
import { act, getByTestId, render } from "test/utilities";
import { configStore } from "..";
import { describe, it } from 'vitest';

const TestingComponent = () => {
    const { accessibility, theme } = React.useContext(AccessibilityContext);

    return (
        <>
            <div data-testid="accessibility">{JSON.stringify(accessibility)}</div>
            <div data-testid="theme">{JSON.stringify(theme)}</div>
        </>
    )
}

describe('AccessibilityProvider', () => {
    it('should render correctly', () => {
        render(<TestingComponent />);

        expect(document.body).toMatchSnapshot();
    });

    it('should render with localStorage accessibility already set', () => {
        localStorage.setItem('accessibility', JSON.stringify({
            fontSize: 20,
            language: 'fr',
            mode: 'dark',
            isDark: true,
        }));

        render(<TestingComponent />);

        const accessibilityText = getByTestId(document.body, 'accessibility');
        const themeText = getByTestId(document.body, 'theme');

        expect(accessibilityText).toHaveTextContent(JSON.stringify({
            fontSize: 20,
            language: 'fr',
            mode: 'dark',
            isDark: true,
        }));

        const theme = JSON.parse(themeText.textContent || '');

        expect(theme.palette.mode).toBe('dark');
    });

    it('should render correctly with dark mode and fontSize and language and isDark', () => {
        const store = configStore;

        render(<TestingComponent />);

        act(() => {
            store.dispatch({ type: "accessibility/setMode", payload: "dark" });
            store.dispatch({ type: "accessibility/setFontSize", payload: 20 });
            store.dispatch({ type: "accessibility/setLanguage", payload: "fr" });
            store.dispatch({ type: "accessibility/setIsDark", payload: true });
        });

        const accessibilityText = getByTestId(document.body, 'accessibility');
        const themeText = getByTestId(document.body, 'theme');

        expect(accessibilityText).toHaveTextContent(JSON.stringify({
            fontSize: 20,
            language: 'fr',
            mode: 'dark',
            isDark: true,
        }));

        const theme = JSON.parse(themeText.textContent || '');

        expect(theme.palette.mode).toBe('dark');
    });

    it('should render correctly with light mode and fontSize and language and isDark', () => {
        const store = configStore;

        render(<TestingComponent />);

        const accessibilityText = getByTestId(document.body, 'accessibility');
        const themeText = getByTestId(document.body, 'theme');

        act(() => {
            store.dispatch({ type: "accessibility/setMode", payload: "light" });
            store.dispatch({ type: "accessibility/setFontSize", payload: 20 });
            store.dispatch({ type: "accessibility/setLanguage", payload: "fr" });
            store.dispatch({ type: "accessibility/setIsDark", payload: true });
        });

        expect(accessibilityText).toHaveTextContent(JSON.stringify({
            fontSize: 20,
            language: 'fr',
            mode: 'light',
            isDark: false,
        }));

        const theme = JSON.parse(themeText.textContent || '');

        expect(theme.palette.mode).toBe('light');
    });
});