// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Prevent TypeScript errors
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Custom command to login as a test user
       * @example cy.login('user@example.com', 'password')
       */
      login(email: string, password: string): Chainable<void>;
      
      /**
       * Custom command to wait for API calls
       * @example cy.waitForApi()
       */
      waitForApi(): Chainable<void>;
      
      /**
       * Custom command to set authenticated user in localStorage
       * @example cy.setAuthenticatedUser('user@example.com')
       */
      setAuthenticatedUser(email?: string): Chainable<void>;
      
      /**
       * Custom command to visit protected routes with authentication
       * @example cy.visitAuthenticated('/webmain/client-area')
       */
      visitAuthenticated(url: string): Chainable<void>;
    }
  }
}
