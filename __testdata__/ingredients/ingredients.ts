import { TIngredient } from '@utils-types';
import ingredientsData from './ingredients.json';
import { TIngredientsResponse } from '@api';

export const ingredientsResponse: TIngredientsResponse = ingredientsData;
export const ingredients: TIngredient[] = ingredientsResponse.data.map(
  (item) => ({
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
  })
);
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
