import { setAsyncActionTests } from '@test-utils';
import {
  createOrder,
  getFeed,
  getOrderByNumber,
  getUserOrders,
  initialOrderState,
  ordersSlice
} from './orders-slice';
import { describe } from '@jest/globals';
import {
  buns,
  mains,
  sauces,
  testNewOrderResponse,
  testSingleOrderResponse,
  testfeedsResponse
} from '@test-data';
import { TOrder } from '@utils-types';

const testErrormessage = 'Error';
/**Мок данных для получения одного заказа */
const singleOrder = testSingleOrderResponse.orders[0];

const { _id, status, name, createdAt, updatedAt, number, ingredients } =
  testNewOrderResponse.order;
/**Новый заказ в хранилище*/
const newOrderState: TOrder = {
  _id,
  status,
  name,
  createdAt,
  updatedAt,
  number,
  ingredients: ingredients.map((item) => item._id)
};

describe('тест order-slice', () => {
  describe('Тесты асинхронных экшенов', () => {
    describe('[#1] getFeed корректно работает с хранилищем', () => {
      const { testCaseFulfilled, testCasePending, testCaseRejected } =
        setAsyncActionTests({
          slice: ordersSlice,
          action: getFeed,
          initialState: initialOrderState,
          spyFn: 'getFeedsApi'
        });
      it(
        '[#1.1] getFeed.pending устанавливает isLoading',
        testCasePending({
          expectedState: {
            ...initialOrderState,
            isLoading: true
          }
        })
      );
      it(
        '[#1.2] getFeed.fulfilled сохраняет данные',
        testCaseFulfilled({
          mockResolvedValue: testfeedsResponse,
          expectedState: {
            ...initialOrderState,
            orders: testfeedsResponse.orders,
            total: testfeedsResponse.total,
            totalToday: testfeedsResponse.totalToday,
            isLoading: false
          }
        })
      );
      it(
        '[#1.3] getFeed.rejected сохраняет ошибку и сбрасывает isLoading',
        testCaseRejected({
          mockRejectedValue: { message: testErrormessage },
          expectedState: {
            ...initialOrderState,
            error: testErrormessage,
            isLoading: false
          }
        })
      );
    });
    describe('[#2] getOrderByNumber корректно работает с хранилищем', () => {
      it(
        '[#2.1] getOrderByNumber.pending устанавливает isLoading и сбрасывает ошибку при наличии',
        setAsyncActionTests({
          slice: ordersSlice,
          action: getOrderByNumber,
          initialState: { ...initialOrderState, error: testErrormessage },
          spyFn: 'getOrderByNumberApi'
        }).testCasePending({
          expectedState: {
            ...initialOrderState,
            isLoading: true,
            error: null
          }
        })
      );
      it(
        '[#2.2] getOrderByNumber.rejected сохраняет ошибку и сбрасывает isLoading',
        setAsyncActionTests({
          slice: ordersSlice,
          action: getOrderByNumber,
          initialState: initialOrderState,
          spyFn: 'getOrderByNumberApi'
        }).testCaseRejected({
          mockRejectedValue: { message: testErrormessage },
          expectedState: {
            ...initialOrderState,
            error: testErrormessage,
            isLoading: false
          }
        })
      );
      it(
        '[#2.3] getOrderByNumber.fulfilled сохраняет корректные данные при пустом списке заказов',
        setAsyncActionTests({
          slice: ordersSlice,
          action: getOrderByNumber,
          initialState: { ...initialOrderState, orders: [] },
          spyFn: 'getOrderByNumberApi',
          actionArgs: singleOrder.number
        }).testCaseFulfilled({
          mockResolvedValue: testSingleOrderResponse,
          expectedState: {
            ...initialOrderState,
            orders: [singleOrder]
          }
        })
      );
    });
    describe('[#3] getUserOrders корректно работает с хранилищем', () => {
      const { testCaseFulfilled, testCasePending, testCaseRejected } =
        setAsyncActionTests({
          slice: ordersSlice,
          action: getUserOrders,
          initialState: initialOrderState,
          spyFn: 'getOrdersApi'
        });
      it(
        '[#3.1] getUserOrders.pending не изменяет состояние',
        testCasePending({
          expectedState: {
            ...initialOrderState
          }
        })
      );
      it(
        '[#3.2] getUserOrders.rejected не изменяет состояние',
        testCaseRejected({
          mockRejectedValue: { message: testErrormessage },
          expectedState: {
            ...initialOrderState
          }
        })
      );
      it(
        '[#3.3] getUserOrders.fulfilled сохраняет корректные данные',
        testCaseFulfilled({
          mockResolvedValue: testfeedsResponse.orders,
          expectedState: {
            ...initialOrderState,
            userOrders: testfeedsResponse.orders
          }
        })
      );
    });
    describe('[#4] createOrder корректно работает с хранилищем', () => {
      const { testCaseFulfilled, testCasePending, testCaseRejected } =
        setAsyncActionTests({
          slice: ordersSlice,
          action: createOrder,
          initialState: initialOrderState,
          spyFn: 'orderBurgerApi',
          actionArgs: [buns[0], buns[0], ...mains, ...sauces]
        });
      it(
        '[#4.1] createOrder.pending устанавливает isLoading',
        testCasePending({
          expectedState: {
            ...initialOrderState,
            isSending: true,
            newOrderError: null
          }
        })
      );
      it(
        '[#4.2] createOrder.rejected сохраняет ошибку и сбрасывает isLoading',
        testCaseRejected({
          mockRejectedValue: { message: testErrormessage },
          expectedState: {
            ...initialOrderState,
            newOrderError: testErrormessage,
            isSending: false
          }
        })
      );
      it(
        '[#4.3] createOrder.fulfilled сохраняет корректные данные',
        testCaseFulfilled({
          mockResolvedValue: testNewOrderResponse,
          expectedState: {
            ...initialOrderState,
            isSending: false,
            newOrder: newOrderState
          }
        })
      );
    });
  });
});
