import { getFeedsApi, getOrderByNumberApi, orderBurgerApi } from '@api';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient, TOrder, TOrdersData } from '@utils-types';
type TOrderSliceState = TOrdersData & {
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  newOrder: TOrder | null;
};

const initialState: TOrderSliceState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  isSending: false,
  error: null,
  newOrder: null
};

export const getFeed = createAsyncThunk('orders/getAll', async () =>
  getFeedsApi()
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getById',
  async (number: number) => getOrderByNumberApi(number)
);
export const createOrder = createAsyncThunk(
  'orders/create',
  async (data: TIngredient[]) =>
    orderBurgerApi(data.map((item) => item._id)).then((data) => {
      const newOrder: TOrder = { ...data.order };
      return newOrder;
    })
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  selectors: {
    getFeedSelector: (state) => state,
    getOrdersSelector: (state) => state.orders,
    isOrderSendingSelector: (state) => state.isSending,
    getNewOrderSelector: (state) => state.newOrder
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(getFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (item) => item.number === action.payload.orders[0].number
        );
        if (index !== -1) {
          state.orders[index] = action.payload.orders[0];
        } else {
          state.orders.push(action.payload.orders[0]);
        }
        state.isLoading = false;
      })
      .addCase(createOrder.pending, (state) => {
        state.isSending = true;
      })
      .addCase(createOrder.rejected, (state) => {
        state.isSending = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isSending = false;
        state.newOrder = action.payload;
      });
  }
});

export const {
  getFeedSelector,
  getOrdersSelector,
  isOrderSendingSelector,
  getNewOrderSelector
} = ordersSlice.selectors;
