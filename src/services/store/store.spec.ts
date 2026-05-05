import React from 'react';
import { rootReducer } from './store';
import { ingredientsSlice } from '../slices/ingredients-slice';
import { constructorSlice } from '../slices/constructor-slice';
import { ordersSlice } from '../slices/orders-slice';
import { userSlice } from '../slices/user-slice';
import { configureStore } from '@reduxjs/toolkit';

describe('Тест корневого редюсера', () => {
  const store = configureStore({
    reducer: rootReducer
  });
  const initialState = { ...store.getState() };
  it('[#1] RootReducer с неизвестными начальным состоянием и экшеном возвращает начальное состояние Хранилища', () => {
    expect(rootReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('[#2] RootReducer реализует inredients-slice', () => {
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState.ingredients).toEqual(
      ingredientsSlice.reducer(undefined, { type: 'unknown' })
    );
  });
  it('[#3] RootReducer реализует constructor-slice', () => {
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState.burgerConstructor).toEqual(
      constructorSlice.reducer(undefined, { type: 'unknown' })
    );
  });
  it('[#4] RootReducer реализует order-slice', () => {
    expect(initialState).toHaveProperty('orders');
    expect(initialState.orders).toEqual(
      ordersSlice.reducer(undefined, { type: 'unknown' })
    );
  });
  it('[#5] RootReducer реализует user-slice', () => {
    expect(initialState).toHaveProperty('orders');
    expect(initialState.user).toEqual(
      userSlice.reducer(undefined, { type: 'unknown' })
    );
  });
});
