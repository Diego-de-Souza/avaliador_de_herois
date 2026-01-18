describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display home page with hero section', () => {
    cy.get('app-hero-section').should('be.visible');
  });

  it('should display navigation header', () => {
    cy.get('app-header').should('be.visible');
  });

  it('should display footer', () => {
    cy.scrollTo('bottom');
    cy.get('app-footer').should('be.visible');
  });

  it('should navigate to articles page', () => {
    cy.get('nav').contains(/artigos/i).click();
    cy.url().should('include', '/artigos');
  });

  it('should navigate to about page', () => {
    cy.get('nav').contains(/about/i).click();
    cy.url().should('include', '/about');
  });

  it('should display featured content sections', () => {
    cy.get('app-destaque').should('be.visible');
    cy.get('app-artigos').should('be.visible');
  });
});
