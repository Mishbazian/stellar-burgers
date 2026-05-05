import {
  TUserState,
  getUser,
  initialUserState,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  userSlice
} from './user-slice';
import { testAuthResponse, testLogoutResponse, testUser } from '@test-data';
import { setAsyncActionTests } from '@test-utils';
import * as api from '@api';
import { UnknownAction, configureStore } from '@reduxjs/toolkit';
import { describe, jest, it } from '@jest/globals';
import { TUser } from '@utils-types';
const testErrorMessage = 'Some error';
const testPassword = 'SomePassword1';
describe('Тест user-slice', () => {
  afterEach(() => {
    localStorage.clear();
    document.cookie =
      'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
  });
  describe('[#1] registerUser корректно работает с хранилищем', () => {
    const { testCaseFulfilled, testCasePending, testCaseRejected } =
      setAsyncActionTests({
        slice: userSlice,
        action: registerUser,
        actionArgs: { ...testUser, password: testPassword },
        initialState: initialUserState,
        spyFn: 'registerUserApi'
      });

    it(
      '[#1.1] registerUser.pending устанавливает isLoading и сбрасывает ошибку регистрации',
      testCasePending({
        expectedState: {
          ...initialUserState,
          isLoading: true,
          registerError: undefined
        }
      })
    );

    it(
      '[#1.2] registerUser.fulfilled сохраняет корректные данные и сбрасывает isLoading ',
      testCaseFulfilled({
        mockResolvedValue: testAuthResponse,
        expectedState: {
          ...initialUserState,
          isLoading: false,
          user: testUser
        }
      })
    );

    it(
      '[#1.3] registerUser.rejected сохраняет сообщение ошибки и сбрасывает isLoading',
      testCaseRejected({
        mockRejectedValue: { message: testErrorMessage },
        expectedState: {
          ...initialUserState,
          isLoading: false,
          registerError: testErrorMessage
        }
      })
    );
  });
  describe('[#2] loginUser корректно работает с хранилищем', () => {
    const { testCaseFulfilled, testCasePending, testCaseRejected } =
      setAsyncActionTests({
        slice: userSlice,
        action: loginUser,
        actionArgs: { email: testUser.email, password: testPassword },
        initialState: initialUserState,
        spyFn: 'loginUserApi'
      });

    it(
      '[#2.1] loginUser.pending устанавливает isLoading и сбрасывает ошибку регистрации',
      testCasePending({
        expectedState: {
          ...initialUserState,
          isLoading: true,
          loginError: undefined
        }
      })
    );

    it(
      '[#2.2] loginUser.fulfilled сохраняет корректные данные и сбрасывает isLoading ',
      testCaseFulfilled({
        mockResolvedValue: testAuthResponse,
        expectedState: {
          ...initialUserState,
          isLoading: false,
          user: testUser
        }
      })
    );

    it(
      '[#2.3] loginUser.rejected сохраняет сообщение ошибки и сбрасывает isLoading',
      testCaseRejected({
        mockRejectedValue: { message: testErrorMessage },
        expectedState: {
          ...initialUserState,
          isLoading: false,
          loginError: testErrorMessage
        }
      })
    );
  });

  describe('[#3] logoutUser корректно работает с хранилищем', () => {
    const { testCaseFulfilled, testCasePending } = setAsyncActionTests({
      slice: userSlice,
      action: logoutUser,
      initialState: {
        ...initialUserState,
        user: testUser,
        logoutError: testErrorMessage
      },
      spyFn: 'logoutApi'
    });

    it(
      '[#3.1] logoutUser.pending устанавливает isLoading и сбрасывает ошибку выхода',
      testCasePending({
        expectedState: {
          ...initialUserState,
          user: testUser,
          isLoading: true,
          logoutError: undefined
        }
      })
    );

    it(
      '[#3.2] logoutUser.fulfilled очищает данные пользователя и сбрасывает isLoading',
      testCaseFulfilled({
        mockResolvedValue: testLogoutResponse,
        expectedState: {
          ...initialUserState,
          user: null,
          isLoading: false,
          logoutError: undefined
        }
      })
    );

    it(
      '[#3.3] logoutUser.rejected записывает ошибку выхода и сбрасывает isLoading',
      setAsyncActionTests({
        slice: userSlice,
        action: logoutUser,
        initialState: {
          ...initialUserState,
          user: testUser,
          logoutError: undefined
        },
        spyFn: 'logoutApi'
      }).testCaseRejected({
        mockRejectedValue: { message: testErrorMessage },
        expectedState: {
          ...initialUserState,
          user: testUser,
          logoutError: testErrorMessage
        }
      })
    );
  });
  describe('[#4] getUser корректно работает с хранилищем', () => {
    beforeEach(() => {
      document.cookie = 'accessToken=accesstokenvalue; path=/';
      localStorage.setItem('refreshToken', 'refreshTokenvalue');
      if (
        !document.cookie.split('accessToken=')[1]?.split(';')[0] ||
        !localStorage.getItem('refreshToken')
      ) {
        throw new Error('Ошибка теста: токен не установлен');
      }
    });

    const { testCaseFulfilled, testCasePending, testCaseRejected } =
      setAsyncActionTests({
        slice: userSlice,
        action: getUser,
        initialState: initialUserState,
        spyFn: 'getUserApi'
      });

    it(
      '[#4.1] getUser.pending не изменяет состояние',
      testCasePending({
        expectedState: {
          ...initialUserState
        }
      })
    );

    it(
      '[#4.2] getUser.fulfilled сохраняет корректные данные и сбрасывает isLoading ',
      testCaseFulfilled({
        mockResolvedValue: testAuthResponse,
        expectedState: {
          ...initialUserState,
          user: testUser,
          isInit: true
        }
      })
    );

    it(
      '[#4.3] getUser.rejected сохраняет сообщение ошибки и сбрасывает isLoading',
      testCaseRejected({
        mockRejectedValue: { message: testErrorMessage },
        expectedState: {
          ...initialUserState,
          isInit: true,
          user: null
        }
      })
    );
  });
  describe('[#5] getUser по умолчанию инициализирует неавторизованного пользователя при отсутствии токенов', () => {
    let store: ReturnType<typeof configureStore>;
    let apiSpy: ReturnType<typeof jest.spyOn>;
    beforeEach(() => {
      store = configureStore({
        reducer: userSlice.reducer
      });
      apiSpy = jest.spyOn(api, 'getUserApi');
    });
    afterEach(() => {
      jest.restoreAllMocks();
      document.cookie =
        'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      localStorage.clear();
    });

    it('[#5.1] Если accessToken отстутсвует в куках, getUser инициализирует неавторизованного пользователя', async () => {
      localStorage.setItem('refreshToken', 'refreshTokenvalue');
      //Предотвращаем запрос к серверу
      apiSpy.mockRejectedValue({
        message: 'API не должен вызываться'
      });
      await store.dispatch(getUser() as unknown as UnknownAction);
      expect(apiSpy).not.toHaveBeenCalled();
      expect(store.getState()).toEqual({
        ...initialUserState,
        user: null,
        isInit: true
      });
    });
    it('[#5.2] Если refreshToken отстутсвует в localStorage, getUser инициализирует неавторизованного пользователя', async () => {
      document.cookie = 'accessToken=accesstokenvalue; path=/';
      //Предотвращаем запрос к серверу
      apiSpy.mockRejectedValue({
        message: 'API не должен вызываться'
      });
      await store.dispatch(getUser() as unknown as UnknownAction);
      expect(apiSpy).not.toHaveBeenCalled();
      expect(store.getState()).toEqual({
        ...initialUserState,
        user: null,
        isInit: true
      });
    });
  });
  describe('[#6] updateUser корректно работает с хранилищем', () => {
    const oldUserData: api.TRegisterData = {
      name: 'Petr',
      email: 'petr@example.com',
      password: 'password'
    };
    const newAuthResponse: api.TAuthResponse = testAuthResponse;
    const newUserData: TUser = testUser;
    const startState: TUserState = { ...initialUserState, user: oldUserData };
    const { testCaseFulfilled, testCasePending, testCaseRejected } =
      setAsyncActionTests({
        slice: userSlice,
        action: updateUser,
        actionArgs: newUserData,
        initialState: startState,
        spyFn: 'updateUserApi'
      });

    it(
      '[#6.1] updateUser.pending устанавливает isLoading и сбрасывает ошибку обновления',
      testCasePending({
        expectedState: {
          ...startState,
          isLoading: true,
          updateUserError: undefined
        }
      })
    );
    it(
      '[#6.2] updateUser.fulfilled сохраняет корректные данные и сбрасывает isLoading',
      testCaseFulfilled({
        mockResolvedValue: newAuthResponse,
        expectedState: {
          ...startState,
          user: newUserData,
          isLoading: false,
          updateUserError: undefined
        }
      })
    );
    it(
      '[#6.3] updateUser.rejected сохраняет сообщение ошибки и сбрасывает isLoading',
      testCaseRejected({
        mockRejectedValue: { message: testErrorMessage },
        expectedState: {
          ...startState,
          isLoading: false,
          updateUserError: testErrorMessage
        }
      })
    );
  });
});
