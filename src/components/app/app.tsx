import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { AppHeader, Modal, OrderInfo } from '@components';

const App = () => {
  /** TODO: взять переменные из стора */
  const error = null;
  const navigate = useNavigate();
  return (
    <div className={styles.app}>
      <AppHeader />
      {error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : (
        <>
          <Routes>
            <Route path='*' element={<NotFound404 />} />
            <Route path='/'>
              <Route index element={<ConstructorPage />} />
              <Route path='feed' element={<Feed />} />
              <Route path='profile' element={<ProtectedRoute />}>
                <Route index element={<Profile />} />
                <Route path='orders' element={<ProfileOrders />} />
              </Route>
              <Route element={<ProtectedRoute onlyUnAuth />}>
                <Route path='login' element={<Login />} />
                <Route path='register' element={<Register />} />
                <Route path='forgot-password' element={<ForgotPassword />} />
                <Route path='reset-password' element={<ResetPassword />} />
              </Route>
            </Route>
          </Routes>

          <Routes>
            <Route
              path='/feed/:number'
              element={
                <Modal title={''} onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              }
            />
            <Route element={<ProtectedRoute />}>
              <Route
                path='/profile/orders/:number'
                element={
                  <Modal title={''} onClose={() => navigate(-1)}>
                    <OrderInfo />
                  </Modal>
                }
              />
            </Route>
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
