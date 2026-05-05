import { configureStore } from '@reduxjs/toolkit';
import type {
  UnknownAction,
  AsyncThunk,
  EnhancedStore,
  Slice,
  ThunkDispatch
} from '@reduxjs/toolkit';
import * as api from '@api';

type TTestCase<T> = {
  expectedState: T;
};
interface TestCasePendingProps<T> extends TTestCase<T> {}
interface TestCaseRejectedProps<T, RejectType> extends TTestCase<T> {
  mockRejectedValue: RejectType;
}
interface TestCaseFulfilledProps<T, ReturnType> extends TTestCase<T> {
  mockResolvedValue: ReturnType;
}

interface SetAsyncThunkTestsProps<
  State,
  Thunk extends AsyncThunk<any, any, any>
> {
  action: Thunk;
  actionArgs?: Parameters<Thunk>[0];
  initialState: State;
  spyFn: keyof typeof api;
  slice: Slice<State>;
}

export function setAsyncActionTests<
  State,
  Thunk extends AsyncThunk<any, any, any>
>({
  slice,
  action,
  actionArgs,
  initialState,
  spyFn
}: SetAsyncThunkTestsProps<State, Thunk>) {
  let store: EnhancedStore<State> & {
    dispatch: ThunkDispatch<State, unknown, UnknownAction>;
  };
  let apiSpy: jest.SpyInstance;

  const prepareTest = () => {
    store = configureStore({
      reducer: slice.reducer,
      preloadedState: initialState // Загрузка начального состояния
    });
    apiSpy = jest.spyOn(api, spyFn);
  };

  const testCasePending =
    ({ expectedState }: TestCasePendingProps<State>) =>
    async () => {
      prepareTest();
      apiSpy.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      const promise = store.dispatch(
        action(actionArgs as Parameters<Thunk>[0])
      );
      expect(apiSpy).toHaveBeenCalledTimes(1);
      expect(store.getState()).toEqual(expectedState);
      promise.abort();
      apiSpy.mockRestore();
    };
  const testCaseFulfilled =
    <ReturnType>(props: TestCaseFulfilledProps<State, ReturnType>) =>
    async () => {
      prepareTest();
      apiSpy.mockResolvedValue(props.mockResolvedValue);
      await store.dispatch(action(actionArgs as Parameters<Thunk>[0]));
      expect(apiSpy).toHaveBeenCalledTimes(1);
      expect(store.getState()).toEqual(props.expectedState);
      apiSpy.mockRestore();
    };
  const testCaseRejected =
    <RejectType>(props: TestCaseRejectedProps<State, RejectType>) =>
    async () => {
      prepareTest();
      apiSpy.mockRejectedValue(props.mockRejectedValue);
      await store.dispatch(action(actionArgs as Parameters<Thunk>[0]));
      expect(apiSpy).toHaveBeenCalledTimes(1);
      expect(store.getState()).toEqual(props.expectedState);
      apiSpy.mockRestore();
    };
  return { testCaseFulfilled, testCasePending, testCaseRejected };
}
