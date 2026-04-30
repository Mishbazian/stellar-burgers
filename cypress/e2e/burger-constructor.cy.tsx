/// <reference types="cypress" />
import { TIngredient } from '../../src/utils/types';
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
    cy.wait('@getIngredients');
  });

  it('[#1]На страницу конструктора загружаются ингредиенты', () => {
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
});
