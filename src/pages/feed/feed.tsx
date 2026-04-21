import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  getFeed,
  getFeedSelector,
  useDispatch,
  useSelector
} from '../../services';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const { isLoading, orders } = useSelector(getFeedSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeed());
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeed());
      }}
    />
  );
};
