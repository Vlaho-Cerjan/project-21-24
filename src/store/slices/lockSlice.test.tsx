import { configStore } from "..";
import { initialState, lockReducer } from "./lockSlice";
import { it } from 'vitest';

it('returns the initial state', () => {
    expect(lockReducer(undefined, { type: "" })).toEqual(initialState);
});

it('handles setting the locked entities', () => {
    const lockedEntities = {
        "1": {
            "test-id": new Date().toISOString()
        }
    }
    const result = lockReducer(initialState, { type: "lock/setLockedEntities", payload: lockedEntities });
    expect(result.lockedEntities).toEqual(lockedEntities);
});

it('handles locking the entity', () => {
    const lockedEntity = {
        entity: "test-entity",
        id: "test-id",
    }
    const result = lockReducer(initialState, { type: "lock/lockEntity", payload: lockedEntity });
    expect(result.lockedEntities[lockedEntity.entity]).toEqual(
        expect.objectContaining({
            [lockedEntity.id]: expect.any(String)
        })
    )
});

it('handles unlocking the entity', () => {
    const lockedEntity = {
        entity: "test-entity",
        id: "test-id",
    }

    const store = configStore;

    store.dispatch({ type: "lock/lockEntity", payload: lockedEntity });

    const state = store.getState().lock;

    expect(state.lockedEntities).toEqual(
        expect.objectContaining({
            [lockedEntity.entity]: expect.any(Object)
        })
    )

    expect(state.lockedEntities[lockedEntity.entity]).toEqual(
        expect.objectContaining({
            [lockedEntity.id]: expect.any(String)
        })
    )

    store.dispatch({ type: "lock/unlockEntity", payload: lockedEntity });

    const result = store.getState().lock;

    expect(result.lockedEntities).toEqual({});
});

it('handles unlocking the entity with multiple entities in lockedEntities', () => {
    const lockedEntity = {
        entity: "test-entity",
        id: "test-id",
    }
    const lockedEntity2 = {
        entity: "test-entity",
        id: "test-id2",
    }
    const lockedEntity3 = {
        entity: "test-entity-2",
        id: "test-id",
    }

    const store = configStore;

    store.dispatch({ type: "lock/lockEntity", payload: lockedEntity });
    store.dispatch({ type: "lock/lockEntity", payload: lockedEntity2 });
    store.dispatch({ type: "lock/lockEntity", payload: lockedEntity3 });

    const state = store.getState().lock;

    expect(state.lockedEntities).toEqual(
        expect.objectContaining({
            [lockedEntity.entity]: expect.any(Object),
            [lockedEntity3.entity]: expect.any(Object)
        })
    )

    expect(state.lockedEntities[lockedEntity.entity]).toEqual(
        expect.objectContaining({
            [lockedEntity.id]: expect.any(String),
            [lockedEntity2.id]: expect.any(String)
        })
    )

    expect(state.lockedEntities[lockedEntity3.entity]).toEqual(
        expect.objectContaining({
            [lockedEntity3.id]: expect.any(String)
        })
    )

    store.dispatch({ type: "lock/unlockEntity", payload: lockedEntity });

    const result = store.getState().lock;

    expect(result.lockedEntities[lockedEntity.entity]).toEqual(
        expect.not.objectContaining({
            [lockedEntity.id]: expect.any(String)
        })
    )

});