import { AppDispatch, RootState, useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  getIngredients,
  getIngredientsSelector
} from '../../services/slices/ingredients-slice';

export const ConstructorPage: FC = () => {
  const { isLoading, ingredients, error } = useSelector(getIngredientsSelector);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getIngredients());
  }, []);

  return (
    <main className={styles.containerMain}>
      {error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : isLoading ? (
        <Preloader />
      ) : ingredients.length > 0 ? (
        <>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </>
      ) : (
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет игредиентов
        </div>
      )}
    </main>
  );
};
