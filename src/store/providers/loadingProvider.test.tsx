import React from "react";
import { LoadingContext } from "./loadingProvider";
import { getByTestId, render } from "test/utilities";
import { describe, it } from 'vitest';

const TestingComponent = () => {
    const { loading, setLoading } = React.useContext(LoadingContext);


    return (
        <>
            <div data-testid="loading">{JSON.stringify(loading)}</div>
            <button data-testid="loadingButton" onClick={() => setLoading(!loading)}>Click</button>
        </>
    )
}

describe('LoadingProvider', () => {
    it('should render correctly', () => {
        render(<TestingComponent />);

        expect(document.body).toMatchSnapshot();
    });

    it('should render correctly with loading true', async () => {
        const { user } = render(<TestingComponent />);

        const loadingText = getByTestId(document.body, 'loading');

        const button = getByTestId(document.body, 'loadingButton');

        expect(loadingText).toHaveTextContent('false');

        await user.click(button);

        expect(loadingText).toHaveTextContent('true');
    });
});