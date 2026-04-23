import { TIconProps } from '@zlden/react-developer-burger-ui-components/dist/ui/icons/utils';
import clsx from 'clsx';
import { FC } from 'react';
import { NavLink, To } from 'react-router-dom';

type TIconNavLincProps = {
  text: string;
  textClassName?: string;
  classNameConst: string | string[];
  classNameActive: string;
  icon: FC<TIconProps>;
  to: To;
};

export const IconNavLink: FC<TIconNavLincProps> = ({
  text,
  textClassName,
  classNameConst,
  classNameActive,
  icon,
  to
}) => {
  const Icon = icon;
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(classNameConst, isActive ? classNameActive : '')
      }
    >
      {({ isActive }) => (
        <>
          <Icon type={isActive ? 'primary' : 'secondary'} />

          <p className={textClassName}>{text}</p>
        </>
      )}
    </NavLink>
  );
};
