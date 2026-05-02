import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import {
  ingredientsSlice,
  constructorSlice,
  ordersSlice,
  userSlice
} from '@slices';

export const rootReducer = combineSlices(
  ingredientsSlice,
  constructorSlice,
  ordersSlice,
  userSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useSelector = selectorHook.withTypes<RootState>();
export const useDispatch = dispatchHook.withTypes<AppDispatch>();

export default store;
