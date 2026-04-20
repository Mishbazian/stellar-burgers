import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TBun, TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as randomUuid } from 'uuid';

type TConstructorState = {
  bun: TBun | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addItem: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload as TBun;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = randomUuid();
        return { payload: { ...ingredient, id } };
      }
    },
    removeItem: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients.filter((item) => item.id !== action.payload.id);
    }
  },
  selectors: {
    getConstructorSelector: (state) => state
  }
});

export const { getConstructorSelector } = constructorSlice.selectors;
export const { addItem, removeItem } = constructorSlice.actions;
export default constructorSlice.reducer;
