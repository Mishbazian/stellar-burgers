/// <reference types="cypress" />
import { TBun, TIngredient } from '../../src/utils/types';
describe('e2e тест конструктора бургеров', () => {
  let ingredientsData: { success: boolean; data: TIngredient[] } = {
    success: false,
    data: []
  };

  before(() => {
    cy.fixture('ingredients.json').then((data) => {
      ingredientsData = { ...data };
    });
  });

  beforeEach(() => {
    cy.intercept('GET', /\/ingredients$/, {
      statusCode: 200,
      body: ingredientsData
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients').its('response.statusCode').should('eq', 200);
  });
  it('[#1.1]На страницу конструктора загружаются ингредиенты', () => {
    cy.get('[data-testid^="ingredient:"]').should(
      'have.length',
      ingredientsData.data.length
    );
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
      cy.get('[data-testid="modal:overlay"]').click('topLeft', { force: true });
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('[#2.3] Модальное окно открывается с данными нужного ингридиента', () => {
      const { _id, name, proteins, fat, carbohydrates, calories, image_large } =
        ingredientsData.data[1];
      cy.get('[data-testid="modal"]').should('not.exist');
      cy.get(`[data-testid="ingredient:${_id}"]`).click();
      cy.get('[data-testid="modal"]')
        .should('be.visible')
        .within(() => {
          cy.contains(name).should('be.exist');
          cy.contains('Белки, г').next().contains(proteins).should('be.exist');
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
    let mains: TIngredient[];
    let buns: TIngredient[];
    let sauces: TIngredient[];
    let addedIngredients: TIngredient[];
    let addedBun: TBun | null;
    before(() => {
      buns = ingredientsData.data.filter((item) => item.type === 'bun');
      sauces = ingredientsData.data.filter((item) => item.type === 'sauce');
      mains = ingredientsData.data.filter((item) => item.type === 'main');
    });
    beforeEach(() => {
      addedIngredients = [];
      addedBun = null;
    });
    it('[#3.1] Можно добавить несколько начинок несколько раз', () => {
      mains.forEach((el) => {
        for (let i = 1; i <= 2; i++) {
          cy.get(`[data-testid="ingredient:${el._id}"]`)
            .find('button')
            .contains('Добавить')
            .click();
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
        for (let i = 1; i <= 2; i++) {
          cy.get(`[data-testid="ingredient:${el._id}"]`)
            .find('button')
            .contains('Добавить')
            .click();
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
        cy.get(`[data-testid="ingredient:${el._id}"]`)
          .find('button')
          .contains('Добавить')
          .click();
        cy.get('.constructor-element_pos_top')
          .should('have.length', 1)
          .contains(el.name);
        cy.get('.constructor-element_pos_bottom')
          .should('have.length', 1)
          .contains(el.name);
      });
    });
  });
});
