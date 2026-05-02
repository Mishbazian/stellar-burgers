import {
  TConstructorState,
  constructorSlice,
  addItem,
  initialState,
  removeItem,
  moveItem,
  clearConstructor
} from './constructor-slice';
import * as helpers from '../../../utils/helpers';
import { buns, sauces, mains } from '@test-data';
import { TBun } from '@utils-types';

let currentState: TConstructorState = { ...initialState };

describe('Тест слайса конструктора бургеров', () => {
  beforeEach(() => {
    currentState = { ...initialState };
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  describe('[#1] addItem Добавляет ингредиенты в конструктор', () => {
    let idCounter = 0;
    jest.mock('../../../utils/helpers');
    const getRandomIdSpy = jest
      .spyOn(helpers, 'getRandomId')
      .mockImplementation(() => `test-${idCounter++}`);

    beforeEach(() => {
      idCounter = 0;
    });

    it('[#1.1] addItem добавляет булочку', () => {
      const newBun = { ...buns[0] };
      const expectedState: TConstructorState = {
        ...currentState,
        bun: { ...newBun, id: `test-0` } as TBun
      };

      const newState = constructorSlice.reducer(currentState, addItem(newBun));
      expect(getRandomIdSpy).toHaveBeenCalled();
      expect(newState).toEqual(expectedState);
    });
    it('[#1.2] addItem заменяет булочку', () => {
      currentState = {
        ...initialState,
        bun: { ...buns[0], id: `test-0` } as TBun
      };
      idCounter = 1;

      const newBun = { ...buns[1] };
      const newState = constructorSlice.reducer(currentState, addItem(newBun));

      const expectedState: TConstructorState = {
        ...initialState,
        bun: { ...newBun, id: `test-1` } as TBun
      };
      expect(newState).toEqual(expectedState);
    });
    it('[#1.3] addItem добавляет начинки', () => {
      const selectedIngredients = [mains[0], sauces[0], mains[0]];
      const addedItems = selectedIngredients.map((item, index) => ({
        ...item,
        id: `test-${index}`
      }));
      const expectedState = {
        ...currentState,
        bun: null,
        ingredients: addedItems
      };

      for (const item of selectedIngredients) {
        const newState = constructorSlice.reducer(currentState, addItem(item));
        Object.assign(currentState, newState);
      }
      expect(currentState).toEqual(expectedState);
    });
  });
  describe('[#2] removeItem удаляет начинку из конструктора', () => {
    it('[#2.1] removeItem удаляет начинку из конструктора по id', () => {
      const addedItems = [
        { ...mains[0], id: 'test-0' },
        { ...sauces[0], id: 'test-1' }
      ];
      const itemToRemove = addedItems[0];
      const prevState: TConstructorState = {
        ...initialState,
        ingredients: addedItems
      };
      const newState = constructorSlice.reducer(
        prevState,
        removeItem(itemToRemove)
      );
      const expectedState: TConstructorState = {
        ...prevState,
        ingredients: addedItems.filter((item) => item.id !== itemToRemove.id)
      };
      expect(newState).toEqual(expectedState);
    });
  });
  describe('[#3] moveItem изменяет порядок ингредиентов в конструкторе', () => {
    const prevBun = { ...buns[0], id: 'test-0' } as TBun;
    const prevItems = [
      { ...mains[0], id: 'test-0' },
      { ...sauces[0], id: 'test-1' },
      { ...mains[1], id: 'test-2' }
    ];

    beforeEach(() => {
      currentState = {
        ...initialState,
        bun: prevBun,
        ingredients: prevItems
      };
    });
    it('[#3.1] moveItem c dir:"up"  перемещает ингридиент выше по списку', () => {
      const movedItem = prevItems[2];
      const expectedItems = [prevItems[0], prevItems[2], prevItems[1]];
      const expectedState: TConstructorState = {
        ...currentState,
        ingredients: expectedItems
      };
      const newState = constructorSlice.reducer(
        currentState,
        moveItem({ ingredient: movedItem, dir: 'up' })
      );
      expect(newState).toEqual(expectedState);
    });
    it('[#3.1] moveItem c dir:"down"  перемещает ингридиент ниже по списку', () => {
      const movedItem = prevItems[0];
      const expectedItems = [prevItems[1], prevItems[0], prevItems[2]];
      const expectedState: TConstructorState = {
        ...currentState,
        ingredients: expectedItems
      };
      const newState = constructorSlice.reducer(
        currentState,
        moveItem({ ingredient: movedItem, dir: 'down' })
      );
      expect(newState).toEqual(expectedState);
    });
  });
  describe('[#4] clearConstructor очищает данные конструктора', () => {
    it('[#4.1] clearConstructor очищает данные конструктора', () => {
      const prevBun = { ...buns[0], id: 'test-0' } as TBun;
      const prevItems = [
        { ...mains[0], id: 'test-0' },
        { ...sauces[0], id: 'test-1' },
        { ...mains[1], id: 'test-2' }
      ];
      currentState = {
        ...initialState,
        bun: prevBun,
        ingredients: prevItems
      };
      const newState = constructorSlice.reducer(
        currentState,
        clearConstructor()
      );
      expect(newState).toEqual(initialState);
    });
  });
});
