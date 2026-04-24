import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { IconNavLink } from '../icon-nav-link/icon-nav-link';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <IconNavLink
          to={'/'}
          icon={BurgerIcon}
          classNameConst={styles.link}
          classNameActive={styles.link_active}
          text={'Конструктор'}
          textClassName='text text_type_main-default ml-2 mr-10'
        />
        <IconNavLink
          to={'feed'}
          icon={ListIcon}
          classNameConst={styles.link}
          classNameActive={styles.link_active}
          text={'Лента заказов'}
          textClassName='text text_type_main-default ml-2'
        />
      </div>
      <div className={styles.logo}>
        <Logo className='' />
      </div>
      <IconNavLink
        to={'profile'}
        icon={ProfileIcon}
        classNameConst={[styles.link, styles.link_position_last]}
        classNameActive={styles.link_active}
        text={userName || 'Личный кабинет'}
        textClassName='text text_type_main-default ml-2'
      />
    </nav>
  </header>
);
