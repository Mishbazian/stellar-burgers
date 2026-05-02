import { TIngredient } from '@utils-types';
import ingredientsData from './ingredients.json';

export const ingredients: TIngredient[] = ingredientsData.data;
export const { buns, sauces, mains } = ingredients.reduce(
  (acc, item) => {
    switch (item.type) {
      case 'bun':
        acc.buns.push(item);
        break;
      case 'sauce':
        acc.sauces.push(item);
        break;
      case 'main':
        acc.mains.push(item);
        break;
    }
    return acc;
  },
  {
    buns: [] as TIngredient[],
    sauces: [] as TIngredient[],
    mains: [] as TIngredient[]
  }
);
