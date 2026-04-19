import { Navigate } from 'react-router';
import { Outlet } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth = false }: ProtectedRouteProps) => {
  //TODO добавить данные из store
  const isAuthenticated = false;
  //TODO обновить маршруты по ТЗ
  if (onlyUnAuth) {
    return isAuthenticated ? <Navigate to='/' replace /> : <Outlet />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />;
};
