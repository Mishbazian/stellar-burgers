import { Navigate } from 'react-router';
import { Outlet, useLocation } from 'react-router-dom';
import { getUserSelector, useSelector } from '../../services';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth = false }: ProtectedRouteProps) => {
  const { user, isInit } = useSelector(getUserSelector);
  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/' } };

  return (
    <>
      {!isInit ? (
        <Preloader />
      ) : onlyUnAuth && user ? (
        <Navigate to={from} replace />
      ) : !user && !onlyUnAuth ? (
        <Navigate to='/login' state={{ from: location.pathname }} />
      ) : (
        <Outlet />
      )}
    </>
  );
};
