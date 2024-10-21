import { rest } from "msw";
import { it } from 'vitest';
import { configStore } from "..";
import { testServerApi } from "../../mocks/handlers";
import { server } from "../../mocks/server";
import { enumReducer, fetchEnum, initialState } from "./enumSlice";

it('returns the initial state', () => {
    expect(enumReducer(undefined, { type: "" })).toEqual(initialState);
});

it('sets fetching true when fetchEnumProject is pending', () => {
    const action = { type: fetchEnum.pending.type };
    const state = enumReducer(initialState, action);
    expect(state).toEqual({ enumProject: null, isLoading: true, error: null });
});

it('sets the enumProject when fetchEnumProject is fulfilled', () => {
    const action = {
        type: fetchEnum.fulfilled.type, payload: [
            {
                id: '1',
                name: "enum1"
            },
            {
                id: '2',
                name: "enum2"
            }
        ]
    };
    const state = enumReducer(initialState, action);
    expect(state.enumProject).not.toBeNull();
    expect(state.enumProject).toHaveLength(2);
    expect(state.enumProject).toEqual([
        {
            id: '1',
            name: "enum1"
        },
        {
            id: '2',
            name: "enum2"
        }
    ]);
});

it('sets fetching false when fetchList is rejected', () => {
    const error = { message: "some error" }
    const action = { type: fetchEnum.rejected.type, error: error };
    const state = enumReducer(initialState, action);
    expect(state.error).toBe(error.message);
    expect(state.error).not.toBe("Bla Bla Bla");
});

it('sets fetching false when fetchList is rejected without a message', () => {
    const error = {}
    const action = { type: fetchEnum.rejected.type, error: error };
    const state = enumReducer(initialState, action);
    expect(state.error).toBe("Something went wrong");
    expect(state.error).not.toBe("Bla Bla Bla");
});

it('checks if setEnumProject sets the enumProject', () => {
    const result = enumReducer(initialState, {
        type: "enum/setEnumProvider",
        payload: [
            {
                id: '1',
                name: "enum1"
            },
            {
                id: '2',
                name: "enum2"
            }
        ]
    })
    expect(result.enumProject).not.toBeNull();
    expect(result.enumProject).toHaveLength(2);
    expect(result.enumProject).toEqual([
        {
            id: '1',
            name: "enum1"
        },
        {
            id: '2',
            name: "enum2"
        }
    ]);
});


it('test fetch function for fetchEnum', async () => {
    const store = configStore;
    const enumProject = [
        {
            id: '1',
            name: "enum1"
        },
        {
            id: '2',
            name: "enum2"
        }
    ]

    const storeResponse = await store.dispatch(fetchEnum());

    expect(storeResponse.type).toBe("fetchEnum/fulfilled");

    expect(storeResponse.payload).toEqual(enumProject);

    // return error
    server.use(
        rest.get(testServerApi + "enum", (req, res, ctx) => {
            return res(ctx.status(500), ctx.json({ message: "Something went wrong" }));
        })
    );

    const storeResponseError: {
        type: string;
        payload?: any;
        error?: any;
        meta: any;
    } = await store.dispatch(fetchEnum());

    expect(storeResponseError.type).toBe("fetchEnum/rejected");

    expect(storeResponseError.error.message).toBe("Something went wrong");
});