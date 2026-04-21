import { Navigate } from 'react-router';
import { Outlet } from 'react-router-dom';
import { getUserSelector, useSelector } from '../../services';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth = false }: ProtectedRouteProps) => {
  const { user } = useSelector(getUserSelector);

  if (onlyUnAuth && user) {
    return <Navigate to='/' replace />;
  }
  if (!user && !onlyUnAuth) return <Navigate to='/login' />;

  return <Outlet />;
};
