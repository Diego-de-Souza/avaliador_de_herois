/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[type="email"], input[name="email"], input[placeholder*="email" i]').type(email);
  cy.get('input[type="password"], input[name="password"]').type(password);
  cy.get('button[type="submit"], button').contains(/login|entrar|acessar/i).click();
  cy.waitForApi();
});

Cypress.Commands.add('waitForApi', () => {
  cy.wait(1000); // Wait for API calls to complete
});

export {};
