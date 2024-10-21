import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { produce } from "immer";
import { enumInterface } from "../../interfaces/enum";
import { RefreshIfLoggedOut } from "../../lib/refreshIfLoggedOut";

export interface EnumState {
    enumProject: enumInterface | null;
    isLoading: boolean;
    error: string | null;
}

export const initialState: EnumState = {
    enumProject: null,
    isLoading: false,
    error: null,
};

export const fetchEnum = createAsyncThunk("fetchEnum", async () => {
    const response = await fetch("/api/enum");
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        const error = await response.json();
        throw new Error(error.message);
    }
});

export const enumSlice = createSlice({
    name: "enum",
    initialState,
    reducers: {
        setEnumProvider: produce((draftState: EnumState, action) => {
            draftState.enumProject = action.payload;
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEnum.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchEnum.fulfilled, (state, action) => {
                return {
                    ...state,
                    isLoading: false,
                    enumProject: action.payload,
                    error: null,
                }
            })
            .addCase(fetchEnum.rejected, (state, action) => {
                if (action.error && action.error.message) {
                    RefreshIfLoggedOut(action.error.message);
                }
                return {
                    ...state,
                    isLoading: false,
                    error: action.error?.message ?? "Something went wrong",
                }
            });
    },
});

export const { setEnumProvider } = enumSlice.actions;
export const enumReducer = enumSlice.reducer;