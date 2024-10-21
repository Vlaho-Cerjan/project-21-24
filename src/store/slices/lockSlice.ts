import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LockedEntities {
    [entity: string]: {
        [id: string]: string;
    };
}

interface LockState {
    lockedEntities: LockedEntities;
}

export const initialState: LockState = {
    lockedEntities: {},
};

export const lockSlice = createSlice({
    name: 'lock',
    initialState,
    reducers: {
        setLockedEntities: (state, action: PayloadAction<LockedEntities>) => {
            state.lockedEntities = action.payload;
            localStorage.setItem('lockedEntities', JSON.stringify(state.lockedEntities));
        },
        lockEntity: (state, action: PayloadAction<{ entity: string; id: string }>) => {
            const { entity, id } = action.payload;
            const entityLocks = state.lockedEntities[entity] ?? {};
            entityLocks[id] = new Date().toISOString();
            state.lockedEntities[entity] = entityLocks;
            localStorage.setItem('lockedEntities', JSON.stringify(state.lockedEntities));
        },
        unlockEntity: (state, action: PayloadAction<{ entity: string; id: string }>) => {
            const { entity, id } = action.payload;
            if (state.lockedEntities[entity] && state.lockedEntities[entity][id]) {
                delete state.lockedEntities[entity][id];
            }

            // remove empty entities
            if (state.lockedEntities[entity] && Object.keys(state.lockedEntities[entity]).length === 0) {
                delete state.lockedEntities[entity];
            }
            localStorage.setItem('lockedEntities', JSON.stringify(state.lockedEntities));
        },
    },
});

export const { setLockedEntities, lockEntity, unlockEntity } = lockSlice.actions;

export const lockReducer = lockSlice.reducer;