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
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { TITLES } from '../../utils/constants';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/services/store';
import { useEffect } from 'react';
import { getIngredients } from '@slices';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  const dispatch = useDispatch<AppDispatch>();
  //TODO пересмотреть получение номера заказа для заголовка модалки
  //TODO вынести обертку для немодальных страниц в отдельный HOC
  //TODO переписать классы через clsx?
  const lastUripart: string = location.pathname.split('/').pop() ?? '';

  useEffect(() => {
    dispatch(getIngredients());
  }, []);
  return (
    <div className={styles.app}>
      <AppHeader />
      <>
        <Routes location={backgroundLocation || location}>
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
            <Route
              path='/feed/:number'
              element={
                <div className={styles.detailPageWrap}>
                  <h2
                    className={`${styles.detailHeader} text text_type_main-large`}
                  >{`#${lastUripart}`}</h2>
                  <OrderInfo />
                </div>
              }
            />
          </Route>
          <Route path='*' element={<NotFound404 />} />
        </Routes>
        {backgroundLocation && (
          <Routes>
            <Route
              path='/feed/:number'
              element={
                <Modal title={`#${lastUripart}`} onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/ingredients/:id'
              element={
                <Modal
                  title={TITLES.INGREDIENTS_DETAILS}
                  onClose={() => navigate(-1)}
                >
                  <IngredientDetails />
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
        )}
      </>
    </div>
  );
};

export default App;
