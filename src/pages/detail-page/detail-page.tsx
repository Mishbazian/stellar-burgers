import { FC, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './detail-page.module.css';

type TDetailPageProps = {
  title: string;
  children?: ReactNode;
};
export const DetailPage: FC<TDetailPageProps> = ({ title, children }) => (
  <div className={styles.detailPageWrap}>
    <h1 className={`${styles.detailHeader} text text_type_main-large`}>
      {title}
    </h1>
    {children}
  </div>
);
