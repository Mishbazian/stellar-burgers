import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { getUsernameSelector, useSelector } from '../../services';

export const AppHeader: FC = () => {
  const userName = useSelector(getUsernameSelector);
  return <AppHeaderUI userName={userName} />;
};
