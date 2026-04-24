import styles from './app-layout.module.css';
import { AppHeader } from '@components';
import { Outlet } from 'react-router-dom';
import { FC } from 'react';

const AppLayout: FC = () => (
  <div className={styles.app}>
    <AppHeader />
    <Outlet />
  </div>
);

export default AppLayout;
