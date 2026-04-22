import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import {
  clearConstructor,
  createOrder,
  getConstructorSelector,
  getNewOrderSelector,
  getUserSelector,
  isOrderSendingSelector
} from '@slices';
import { useDispatch, useSelector } from '../../services';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(getConstructorSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderRequest = useSelector(isOrderSendingSelector);
  const orderModalData = useSelector(getNewOrderSelector);
  const { user } = useSelector(getUserSelector);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('login');
      return;
    }
    dispatch(
      createOrder([
        ...constructorItems.ingredients,
        constructorItems.bun,
        constructorItems.bun
      ])
    );
  };
  const closeOrderModal = () => {
    dispatch(clearConstructor());
    navigate('/feed');
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
