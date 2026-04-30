/// <reference types="cypress" />
import '../support';

import { TIngredient } from '../../src/utils/types';

describe('Тест конструктора бургеров', () => {
  let ingredientsData: { success: boolean; data: TIngredient[] } = {
    success: false,
    data: []
  };
  let mains: TIngredient[] = [];
  let buns: TIngredient[] = [];
  let sauces: TIngredient[] = [];
  let addedIngredients: TIngredient[] = [];

  beforeEach(() => {
    mains = [];
    buns = [];
    sauces = [];
    addedIngredients = [];

    cy.fixture('ingredients.json').then((data) => {
      ingredientsData = { ...data };
      buns = [...ingredientsData.data.filter((item) => item.type === 'bun')];
      sauces = [
        ...ingredientsData.data.filter((item) => item.type === 'sauce')
      ];
      mains = [...ingredientsData.data.filter((item) => item.type === 'main')];

      cy.intercept('GET', /\/ingredients$/, {
        statusCode: 200,
        body: ingredientsData
      }).as('getIngredients');
    });
  });
  describe('Пользователь неавторизован', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.wait('@getIngredients').its('response.statusCode').should('eq', 200);
    });
    describe('Ингридиенты', () => {
      it('[#1.1]На страницу конструктора загружаются ингредиенты', () => {
        cy.get('[data-testid^="ingredient:"]').should(
          'have.length',
          ingredientsData.data.length
        );
      });
    });
    describe('[#2]Модальное окно', () => {
      it('[#2.1] Модальное окно открывается кликом на ингредиент и закрывается крестиком', () => {
        const { _id } = ingredientsData.data[1];
        cy.get('[data-testid="modal"]').should('not.exist');
        cy.get(`[data-testid="ingredient:${_id}"]`).click();
        cy.get('[data-testid="modal"]').should('be.visible');
        cy.get('[data-testid="modal:close"]').click();
        cy.get('[data-testid="modal"]').should('not.exist');
      });

      it('[#2.2] Модальное окно открывается кликом на ингредиент и закрывается кликом на оверлей', () => {
        const { _id } = ingredientsData.data[1];
        cy.get('[data-testid="modal"]').should('not.exist');
        cy.get(`[data-testid="ingredient:${_id}"]`).click();
        cy.get('[data-testid="modal:overlay"]').click('topLeft', {
          force: true
        });
        cy.get('[data-testid="modal"]').should('not.exist');
      });

      it('[#2.3] Модальное окно открывается с данными нужного ингридиента', () => {
        const {
          _id,
          name,
          proteins,
          fat,
          carbohydrates,
          calories,
          image_large
        } = ingredientsData.data[1];
        cy.get('[data-testid="modal"]').should('not.exist');
        cy.get(`[data-testid="ingredient:${_id}"]`).click();
        cy.get('[data-testid="modal"]')
          .should('be.visible')
          .within(() => {
            cy.contains(name).should('be.exist');
            cy.contains('Белки, г')
              .next()
              .contains(proteins)
              .should('be.exist');
            cy.contains('Жиры, г').next().contains(fat).should('be.exist');
            cy.contains('Углеводы, г')
              .next()
              .contains(carbohydrates)
              .should('be.exist');
            cy.contains('Калории, ккал')
              .next()
              .contains(calories)
              .should('be.exist');
            cy.get('img').should('have.attr', 'src', image_large);
            cy.get('[data-testid="modal:close"]').click();
          });
      });
    });
    describe('[#3] Добавление ингредиентов в конструктор', () => {
      it('[#3.1] Можно добавить несколько начинок несколько раз', () => {
        mains.forEach((el) => {
          //Добавляем по две порции каждой начинки
          for (let i = 1; i <= 2; i++) {
            cy.addIngredient(el._id);
            addedIngredients.push(el);
            cy.get('.constructor-element').should(
              'have.length',
              addedIngredients.length
            );
          }
        });
      });
      it('[#3.2] Можно добавить несколько соусов несколько раз', () => {
        sauces.forEach((el) => {
          //Добавляем по две порции каждого соуса
          for (let i = 1; i <= 2; i++) {
            cy.addIngredient(el._id);
            addedIngredients.push(el);
            cy.get('.constructor-element').should(
              'have.length',
              addedIngredients.length
            );
          }
        });
      });
      it('[#3.3] Можно добавить только одну булочку', () => {
        buns.forEach((el) => {
          //Каждую булочку  кликаем дважды
          cy.addIngredient(el._id);
          cy.addIngredient(el._id);
          cy.get('.constructor-element_pos_top')
            .should('have.length', 1)
            .contains(el.name);
          cy.get('.constructor-element_pos_bottom')
            .should('have.length', 1)
            .contains(el.name);
        });
      });
    });
    describe('[4] Заказ', () => {
      it('[#4.1]Неавторизованный пользователь не может оформить заказ', () => {
        cy.addIngredient(buns[0]._id);
        //Добавляем остальные ингредиенты
        ingredientsData.data
          .filter((item) => item.type !== 'buns')
          .forEach((item) => {
            cy.addIngredient(item._id);
          });
        //клик кнопки заказа
        cy.get(`[data-testid="order:create"]`).click();
        cy.intercept('POST', /\/orders$/, () => {
          expect(true).to.eq(false);
        });
        cy.url().should('include', '/login');
      });
    });
  });

  describe('Пользователь авторизован', () => {
    beforeEach(() => {
      //Загружаем токены в клиент
      cy.fixture('token.json').then((data) => {
        cy.setCookie('accessToken', data.accessToken);
        cy.window().then((w) => {
          w.localStorage.setItem('refreshToken', data.refreshToken);
        });
      });
      //Подменяем ответ на запрос пользователя
      cy.fixture('user.json').then((data) => {
        cy.intercept('GET', /\/auth\/user$/, {
          statusCode: 200,
          body: data
        }).as('getUser');
      });
      cy.visit('/');
      cy.wait('@getIngredients').its('response.statusCode').should('eq', 200);
      //Ждем загрузки польователя
      cy.wait('@getUser').its('response.statusCode').should('eq', 200);
    });
    describe('[4] Заказ', () => {
      it('[#4.2]Авторизованный пользователь может оформить заказ, конструктор очищается', () => {
        let orderNaumber: number;
        //Подменяем ответ на запрос создания заказа
        cy.fixture('order-success.json').then((data) => {
          orderNaumber = data.order.number;
          cy.intercept('POST', /\/orders$/, {
            statusCode: 200,
            body: data
          }).as('postOrder');
        });

        //Добавляем булочку
        cy.addIngredient(buns[0]._id);
        //Добавляем остальные ингредиенты
        ingredientsData.data
          .filter((item) => item.type !== 'buns')
          .forEach((item) => {
            cy.addIngredient(item._id);
          });
        //клик кнопки заказа
        cy.get(`[data-testid="order:create"]`).click();
        cy.wait('@postOrder').its('response.statusCode').should('eq', 200);
        //Проверяем номер заказа в модалке
        cy.get('[data-testid="modal"]')
          .should('be.visible')
          .within(() => {
            cy.contains(orderNaumber);
          });
        //Закрываем модальное окно
        cy.get('[data-testid="modal:close"]').click();
        cy.get('[data-testid="modal"]').should('not.exist');
        //Проверяем очистку конструктора
        cy.get('.constructor-element').should('have.length', 0);
        cy.get('.constructor-element_pos_top').should('have.length', 0);
        cy.get('.constructor-element_pos_bottom').should('have.length', 0);
      });
    });
  });
});
