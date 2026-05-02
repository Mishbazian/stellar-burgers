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
  getIngredientsApi().then((data) =>
    data.map((item) => ({
      _id: item._id,
      name: item.name,
      type: item.type,
      proteins: item.proteins,
      fat: item.fat,
      carbohydrates: item.carbohydrates,
      calories: item.calories,
      price: item.price,
      image: item.image,
      image_large: item.image_large,
      image_mobile: item.image_mobile
    }))
  )
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsSelector: (state) => state
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

export const { getIngredientsSelector } = ingredientsSlice.selectors;
export const ingredientsReducer = ingredientsSlice.reducer;
export const initialIngredientsState = initialState;
