import { loadingReducer, initialState } from "./loadingSlice";
import { it } from 'vitest';

it('returns the initial state', () => {
    expect(loadingReducer(undefined, { type: "" })).toEqual(initialState);
});

it('handles setting the loading state', () => {
    const loading = true;
    const result = loadingReducer(initialState, { type: "loading/setLoading", payload: loading });
    expect(result.loading).toEqual(loading);
});