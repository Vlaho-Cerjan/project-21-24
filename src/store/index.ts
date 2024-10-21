import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { accessibilityReducer } from './slices/accessibilitySlice';
import { enumReducer } from './slices/enumSlice';
import { loadingReducer } from './slices/loadingSlice';
import { lockReducer } from './slices/lockSlice';

const combinedReducer = combineReducers({
  accessibility: accessibilityReducer,
  enum: enumReducer,
  loading: loadingReducer,
  lock: lockReducer,
});

export const configStore = configureStore({
  reducer: combinedReducer
})

const store = configStore;

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;