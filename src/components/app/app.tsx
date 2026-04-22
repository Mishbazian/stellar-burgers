import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
  DetailPage
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { IngredientDetails, Modal, OrderInfo } from '@components';
import { TITLES } from '../../utils/constants';

import { useEffect } from 'react';
import { getIngredients, getUser, getUserSelector } from '@slices';
import { useDispatch, useSelector } from '../../services';
import { getCookie } from '../../utils/cookie';
import AppLayout from '../../layouts/app-layout';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  const dispatch = useDispatch();
  //TODO пересмотреть получение номера заказа для заголовка модалки
  //TODO переписать классы через clsx?
  //TODO найти причину ререндера App
  const lastUripart: string = location.pathname.split('/').pop() ?? '';
  const { isInit } = useSelector(getUserSelector);

  useEffect(() => {
    dispatch(getIngredients());
    if (getCookie('accessToken') && !isInit) dispatch(getUser());
  }, []);
  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<ConstructorPage />} />
          <Route path='feed' element={<Feed />} />
          <Route
            path='ingredients/:id'
            element={
              <DetailPage title={TITLES.INGREDIENTS_DETAILS}>
                <IngredientDetails />
              </DetailPage>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <DetailPage title={`#${lastUripart}`}>
                <OrderInfo />
              </DetailPage>
            }
          />

          <Route path='profile' element={<ProtectedRoute />}>
            <Route index element={<Profile />} />
            <Route path='orders' element={<ProfileOrders />} />
            <Route
              path='orders/:number'
              element={
                <DetailPage title={`#${lastUripart}`}>
                  <OrderInfo />
                </DetailPage>
              }
            />
          </Route>
          <Route element={<ProtectedRoute onlyUnAuth />}>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='forgot-password' element={<ForgotPassword />} />
            <Route path='reset-password' element={<ResetPassword />} />
          </Route>
          <Route path='*' element={<NotFound404 />} />
        </Route>
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${lastUripart}`}
                onClose={() => navigate(backgroundLocation)}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='ingredients/:id'
            element={
              <Modal
                title={TITLES.INGREDIENTS_DETAILS}
                onClose={() => navigate(backgroundLocation)}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path='/profile/orders/:number'
              element={
                <Modal
                  title={`#${lastUripart}`}
                  onClose={() => navigate(backgroundLocation)}
                >
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Routes>
      )}
    </>
  );
};

export default App;
