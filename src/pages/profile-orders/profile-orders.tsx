import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  getUserOrders,
  getUserOrdersSelector,
  useDispatch,
  useSelector
} from '../../services';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(getUserOrdersSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrders());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
