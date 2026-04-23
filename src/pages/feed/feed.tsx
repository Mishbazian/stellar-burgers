import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  clearNewOrder,
  getFeed,
  getFeedSelector,
  useDispatch,
  useSelector
} from '../../services';

export const Feed: FC = () => {
  const { isLoading, orders } = useSelector(getFeedSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeed());
    setTimeout(() => {
      dispatch(clearNewOrder());
    }, 5000);
  }, []);

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <FeedUI
          orders={orders}
          handleGetFeeds={() => {
            dispatch(getFeed());
          }}
        />
      )}
    </>
  );
};
