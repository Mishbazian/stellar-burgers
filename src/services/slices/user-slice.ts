import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi
} from '@api';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: TLoginData) => {
    const userData = await loginUserApi({ email, password });
    localStorage.setItem('refreshToken', userData.refreshToken);
    setCookie('accessToken', userData.accessToken);
    return userData;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ email, name, password }: TRegisterData) => {
    const userData = await registerUserApi({ email, name, password });
    localStorage.setItem('refreshToken', userData.refreshToken);
    setCookie('accessToken', userData.accessToken);
    return userData;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    await logoutApi();
    localStorage.removeItem('refreshToken'); // очищаем refreshToken
    deleteCookie('accessToken'); // очищаем accessToken
    dispatch(userLogout()); // удаляем пользователя из хранилища
  }
);

export const getUser = createAsyncThunk('user/get', async () => getUserApi());

type TUserState = {
  user: TUser | null;
  isLoading: boolean;
  loginError: string | undefined;
  registerError: string | undefined;
};
const initialState: TUserState = {
  user: null,
  isLoading: false,
  loginError: undefined,
  registerError: undefined
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLogout: (state) => {
      state = initialState;
    }
  },
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
      })
      .addCase(getUser.rejected, (state) => {
        state = initialState;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  }
});

export const { getUserSelector, getUsernameSelector } = userSlice.selectors;
const { userLogout } = userSlice.actions;
