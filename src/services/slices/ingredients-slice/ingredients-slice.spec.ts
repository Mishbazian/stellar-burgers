import {
  getIngredients,
  ingredientsSlice,
  initialIngredientsState
} from './ingredients-slice';
import { ingredients, ingredientsResponse } from '@test-data';
import { describe, jest } from '@jest/globals';
import { setAsyncActionTests } from '@test-utils';

describe('тест ingredients-slice', () => {
  describe('asyncThunk getIngredients корректно работает с хранилищем', () => {
    const { testCaseFulfilled, testCasePending, testCaseRejected } =
      setAsyncActionTests({
        slice: ingredientsSlice,
        action: getIngredients,
        initialState: initialIngredientsState,
        spyFn: 'getIngredientsApi'
      });

    it(
      '[#1.1] getIngredients.pending устанавливает isLoading',
      testCasePending({
        expectedState: {
          ...initialIngredientsState,
          isLoading: true
        }
      })
    );
    it(
      '[#1.2] getIngredients.fullfilled сохраняет корректные данные и сбрасывает isLoading',
      testCaseFulfilled({
        mockResolvedValue: ingredientsResponse.data,
        expectedState: {
          ...initialIngredientsState,
          isLoading: false,
          ingredients: ingredients
        }
      })
    );
    it(
      '[#1.3] getIngredients.rejected сохраняет сообщение ошибки и сбрасывает isLoading',
      testCaseRejected({
        mockRejectedValue: { message: 'Error message' },
        expectedState: {
          ...initialIngredientsState,
          isLoading: false,
          error: 'Error message'
        }
      })
    );
  });
});
