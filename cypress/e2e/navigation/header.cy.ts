describe('Header Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display header with logo', () => {
    cy.get('header, app-header').should('be.visible');
    cy.get('img[alt*="logo" i], img[alt*="Logo"]').should('be.visible');
  });

  it('should navigate to home when clicking logo', () => {
    cy.get('a[routerLink="/"], a[href="/"]').first().click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should display navigation menu items', () => {
    cy.get('nav').should('be.visible');
    cy.get('nav').should('contain.text', 'Home');
    cy.get('nav').should('contain.text', 'Artigos');
  });

  it('should show login button when not authenticated', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.get('a[href*="login"], button').contains(/login|entrar/i).should('be.visible');
  });

  it('should show user menu when authenticated', () => {
    // This would require mocking authentication
    cy.login('test@example.com', 'password123');
    cy.get('app-menu-user, [data-cy="user-menu"]').should('be.visible');
  });

  it('should toggle theme when clicking theme button', () => {
    const initialTheme = cy.get('body').should('have.class', 'dark').or('have.class', 'light');
    cy.get('button').contains(/tema|theme/i).click();
    cy.get('body').should('not.have.class', initialTheme);
  });
});
