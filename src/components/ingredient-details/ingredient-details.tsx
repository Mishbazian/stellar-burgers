import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { getIngredientsSelector } from '@slices';
import { useSelector } from '../../services';

export const IngredientDetails: FC = () => {
  const { id } = useParams<'id'>();
  const { ingredients } = useSelector(getIngredientsSelector);
  const ingredientData = ingredients.find((item) => item._id == id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
