import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { TIngredient, TIngredientsGroups, TTabMode } from '@utils-types';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const getIngredients = createAsyncThunk('ingredients/getAll', async () =>
  getIngredientsApi()
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsSelector: (state) => state,
    getGrouppedIngredients: (state) =>
      state.ingredients.reduce((acc, item) => {
        const type = item.type as TTabMode;
        if (!acc[type]) acc[type] = [];
        acc[type]?.push(item);
        return acc;
      }, {} as TIngredientsGroups)
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
      });
  }
});

export const { getIngredientsSelector, getGrouppedIngredients } =
  ingredientsSlice.selectors;
export const ingredientsReducer = ingredientsSlice.reducer;
