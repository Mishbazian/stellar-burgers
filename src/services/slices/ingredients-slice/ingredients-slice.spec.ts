import { configureStore } from '@reduxjs/toolkit';
import {
  getIngredients,
  ingredientsSlice,
  initialIngredientsState
} from './ingredients-slice';
import * as api from '@api';
import { ingredients, ingredientsResponse } from '@test-data';
import { expect, it, describe, jest } from '@jest/globals';

describe('тест ingredients-slice', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  describe('[#1] asyncThunk getIngredients корректно работает с хранилищем', () => {
    it('[#1.1] getIngredients.pending устанавливает isLoading', async () => {
      const getIngredientsApiSpy = jest.spyOn(api, 'getIngredientsApi');
      //Подменяем запрос Промисом с таймаутом
      jest
        .spyOn(api, 'getIngredientsApi')
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(resolve, 100000))
        );

      const store = configureStore({
        reducer: { ingredients: ingredientsSlice.reducer }
      });
      const promise = store.dispatch(getIngredients());
      const expectedState = {
        ...initialIngredientsState,
        isLoading: true
      };

      expect(getIngredientsApiSpy).toHaveBeenCalledTimes(1);
      expect(store.getState().ingredients).toEqual(expectedState);
      //Принудительно отменяем промис
      promise.abort();
    });
    it('[#1.1] getIngredients.fullfilled сохраняет корректные данные и сбрасывает isLoading', async () => {
      const getIngredientsApiSpy = jest
        .spyOn(api, 'getIngredientsApi')
        .mockResolvedValue(ingredientsResponse.data);
      const store = configureStore({
        reducer: { ingredients: ingredientsSlice.reducer }
      });
      await store.dispatch(getIngredients());

      const expectedState = {
        ...initialIngredientsState,
        isLoading: false,
        ingredients: ingredients
      };
      expect(getIngredientsApiSpy).toHaveBeenCalledTimes(1);
      expect(store.getState().ingredients).toEqual(expectedState);
    });
    it('[#1.2] getIngredients.rejected сохраняет сообщение ошибки и сбрасывает isLoading', async () => {
      const errorMessage = 'Текст ошибки';
      const getIngredientsApiSpy = jest
        .spyOn(api, 'getIngredientsApi')
        .mockRejectedValue({ message: errorMessage });
      const store = configureStore({
        reducer: { ingredients: ingredientsSlice.reducer }
      });
      await store.dispatch(getIngredients());
      const expectedState = {
        ...initialIngredientsState,
        isLoading: false,
        error: errorMessage
      };
      expect(getIngredientsApiSpy).toHaveBeenCalledTimes(1);
      expect(store.getState().ingredients).toEqual(expectedState);
    });
  });
});
