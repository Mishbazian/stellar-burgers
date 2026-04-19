import { ConstructorPage, Feed } from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Preloader } from '@ui';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  /** TODO: взять переменные из стора */
  const error = null;

  return (
    <div className={styles.app}>
      <AppHeader />
      {error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : (
        <ConstructorPage />
      )}
    </div>
  );
};

export default App;
