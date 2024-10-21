import React from "react";
import { LockContext } from "./lockProvider";
import { render, screen } from "test/utilities";
import { LockedEntities } from '../slices/lockSlice';
import { server } from "../../mocks/server";
import { rest } from "msw";
import { testServerApi } from "../../mocks/handlers";
import { describe, it } from 'vitest';

const TestComponent = () => {
    const { lockedEntities, lockEntity, timeLeft } = React.useContext(LockContext);

    const [timeLeftValue, setTimeLeftValue] = React.useState<number | null>(null);

    const [errorText, setErrorText] = React.useState<string | null>(null);

    const abort = new AbortController();

    return (
        <>
            <div data-testid="lockedEntities">{JSON.stringify(lockedEntities)}</div>
            <button data-testid="lockEntityButton" onClick={() => {
                try {
                    lockEntity('test-entity', '1', 'lock', abort).catch(e => {console.log(e, 'error'), setErrorText(e.message)})
                }
                catch (e: any) {
                    console.log(e, 'error');
                    setErrorText(e.message);
                }
            }}>Click</button>
            <button data-testid="lockEntityButtonWithError" onClick={() => {
                try {
                    lockEntity('', '1', 'lock').catch(e => setErrorText(e.message))
                }
                catch (e: any) {
                    setErrorText(e.message)
                }
            }}>Click</button>
            <button data-testid="unlockEntityButton" onClick={() => {
                try {
                    lockEntity('test-entity', '1', 'unlock').catch(e => setErrorText(e.message))
                }
                catch (e: any) {
                    setErrorText(e.message)
                }
            }}>Click</button>
            <div data-testid="timeLeft">{JSON.stringify(timeLeftValue)}</div>
            <button
                data-testid="timeLeftButton"
                onClick={() => {
                    const time = timeLeft('test-entity', '1');
                    setTimeLeftValue(time);
                }}
            >
                Click
            </button>
            <div data-testid="errorText">{errorText}</div>
            <button
                data-testid="abortFunctionButton"
                onClick={() => {
                    lockEntity('test-entity', '1', 'lock', abort).catch(e => setErrorText(e.message));
                    abort.abort();
                }}
            >
                Click
            </button>
        </>
    )
}

describe('LockProvider', () => {
    it('should render correctly', () => {
        render(<TestComponent />);

        expect(document.body).toMatchSnapshot();
    });

    it('should render with localStorage lockedEntities already set', () => {
        const date = new Date().toISOString();

        localStorage.setItem('lockedEntities', JSON.stringify({
            'test-entity': {
                '1': date
            }
        } as LockedEntities));

        render(
            <TestComponent />
        );

        const lockedEntitiesText = screen.getByTestId('lockedEntities');

        expect(lockedEntitiesText).toHaveTextContent(JSON.stringify({
            'test-entity': {
                '1': date
            }
        }));
    });

    it('should render with expired (> 10 min ago) localStorage lockedEntities already set and remove it', () => {
        const date = new Date();

        date.setMinutes(date.getMinutes() - 11);

        localStorage.setItem('lockedEntities', JSON.stringify({
            'test-entity': {
                '1': date.toISOString()
            }
        } as LockedEntities));

        render(
            <TestComponent />
        );

        const lockedEntitiesText = screen.getByTestId('lockedEntities');

        expect(lockedEntitiesText).toHaveTextContent(JSON.stringify({}));

        expect(localStorage.getItem('lockedEntities')).toEqual(JSON.stringify({}));
    });

    it('should render without localStorage', async () => {
        const { user } = render(
            <TestComponent />
        );

        localStorage.removeItem('lockedEntities');

        const timeLeftText = screen.getByTestId('timeLeft');

        const timeLeftButton = screen.getByTestId('timeLeftButton');

        await user.click(timeLeftButton);

        expect(timeLeftText).toHaveTextContent('0');

        const lockedEntitiesText = screen.getByTestId('lockedEntities');

        expect(lockedEntitiesText).toHaveTextContent(JSON.stringify({}));
    });

    it('should render correctly with lockEntity', async () => {
        const { user } = render(
            <TestComponent />
        );

        const lockedEntitiesText = screen.getByTestId('lockedEntities');

        const lockEntityButton = screen.getByTestId('lockEntityButton');


        await user.click(lockEntityButton);

        const lockedText = lockedEntitiesText.textContent;

        expect(lockedText).toEqual(expect.stringContaining('test-entity'));

        const unlockEntityButton = screen.getByTestId('unlockEntityButton');

        await user.click(unlockEntityButton);

        expect(lockedEntitiesText).toHaveTextContent(JSON.stringify({}));
    });

    it.fails('should throw an error when trying to unlock an entity that is not locked', async () => {
        const { user } = render(
            <TestComponent />
        );

        const unlockEntityButton = screen.getByTestId('unlockEntityButton');

        const error = await user.click(unlockEntityButton);

        expect(error).rejects.toThrowError('Entity not found');

        const errorText = screen.getByTestId('errorText');

        expect(errorText).toHaveTextContent('Entity not found');

    });

    it.fails('should throw an error when trying to lock an entity without entity type', async () => {
        const { user } = render(
            <TestComponent />
        );

        const lockEntityButton = screen.getByTestId('lockEntityButtonWithError');

        const error = await user.click(lockEntityButton);

        expect(error).rejects.toThrowError('Entity type is required');

        const errorText = screen.getByTestId('errorText');

        expect(errorText).toHaveTextContent('Entity type is required');
    });

    it('should throw an error on abort from abortcontroller', async () => {
        const { user } = render(
            <TestComponent />
        );

        server.use(
            // abort the request immediately
            rest.post(testServerApi + 'cms', (req, res, ctx) => {
                return res(ctx.delay(Infinity));
            })
        )

        const errorFunctionButton = screen.getByTestId('abortFunctionButton');

        await user.click(errorFunctionButton)

        const errorText = screen.getByTestId('errorText');

        expect(errorText).toHaveTextContent('The user aborted the request');
    });
});