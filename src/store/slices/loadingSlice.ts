import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const defaultLoading = false;

export interface LoadingState {
    loading: boolean;
}

export const initialState: LoadingState = {
    loading: defaultLoading,
};

export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setLoading } = loadingSlice.actions;

export const loadingReducer = loadingSlice.reducer;