import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
type TOrderSliceState = TOrdersData & {
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderSliceState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const getFeed = createAsyncThunk('orders/getAll', async () =>
  getFeedsApi()
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getById',
  async (number: number) => getOrderByNumberApi(number)
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  selectors: {
    getFeedSelector: (state) => state,
    getOrdersSelector: (state) => state.orders
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
      });
  }
});

export const { getFeedSelector, getOrdersSelector } = ordersSlice.selectors;
