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
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload.id
      );
    },
    moveItem: (
      state,
      action: PayloadAction<{
        ingredient: TConstructorIngredient;
        dir: 'up' | 'down';
      }>
    ) => {
      const { ingredient, dir } = action.payload;
      const startPos: number = state.ingredients.findIndex(
        (item) => item.id === ingredient.id
      );
      if (
        (dir === 'up' && startPos === 0) ||
        (dir === 'down' && startPos >= state.ingredients.length - 1)
      )
        return;
      switch (dir) {
        case 'up':
          [state.ingredients[startPos], state.ingredients[startPos - 1]] = [
            state.ingredients[startPos - 1],
            state.ingredients[startPos]
          ];
          break;
        case 'down':
          [state.ingredients[startPos], state.ingredients[startPos + 1]] = [
            state.ingredients[startPos + 1],
            state.ingredients[startPos]
          ];
          break;
      }
    },
    clearConstructor: (state) => {
      state = initialState;
    }
  },
  selectors: {
    getConstructorSelector: (state) => state
  }
});

export const { getConstructorSelector } = constructorSlice.selectors;
export const { addItem, removeItem, moveItem, clearConstructor } =
  constructorSlice.actions;
