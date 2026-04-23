import {
  TAuthResponse,
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

const setClientUser = (userData: TAuthResponse) => {
  localStorage.setItem('refreshToken', userData.refreshToken);
  setCookie('accessToken', userData.accessToken);
};

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: TLoginData) => loginUserApi({ email, password })
);

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ email, name, password }: TRegisterData) =>
    registerUserApi({ email, name, password })
);

export const logoutUser = createAsyncThunk('user/logout', async () =>
  logoutApi()
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => updateUserApi(data)
);

export const getUser = createAsyncThunk('user/get', async () => getUserApi());

type TUserState = {
  user: TUser | null;
  isLoading: boolean;
  loginError: string | undefined;
  registerError: string | undefined;
  updateUserError: string | undefined;
  logoutError: string | undefined;
  isInit: boolean;
};
const initialState: TUserState = {
  user: null,
  isLoading: false,
  loginError: undefined,
  registerError: undefined,
  updateUserError: undefined,
  logoutError: undefined,
  isInit: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    getUserSelector: (state) => state,
    getUsernameSelector: (state) => state.user?.name
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.registerError = undefined;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerError = action.error.message;
        state.isLoading = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
        state.registerError = undefined;
        setClientUser(action.payload);
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.loginError = undefined;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.loginError = action.error.message;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loginError = undefined;
        state.isLoading = false;
        setClientUser(action.payload);
      })
      .addCase(getUser.rejected, (state) => {
        state.user = null;
        state.isInit = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isInit = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.updateUserError = undefined;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.updateUserError = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
        state.updateUserError = undefined;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.logoutError = undefined;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.logoutError = action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = null;
        state.isLoading = false;
        state.logoutError = undefined;
        localStorage.removeItem('refreshToken'); // очищаем refreshToken
        deleteCookie('accessToken'); // очищаем accessToken
      });
  }
});

export const { getUserSelector, getUsernameSelector } = userSlice.selectors;
