describe('Articles Page', () => {
  beforeEach(() => {
    cy.visit('/webmain/artigos');
  });

  it('should display articles list', () => {
    cy.get('app-article-page').should('be.visible');
  });

  it('should have search functionality', () => {
    cy.get('input[type="search"], input[placeholder*="buscar" i]').should('exist');
  });

  it('should filter articles by search', () => {
    cy.get('input[type="search"]').type('marvel');
    cy.wait(1000);
    // Articles should be filtered
  });

  it('should navigate to article detail when clicking on article', () => {
    cy.get('app-article-card, [data-cy="article-card"]').first().click();
    cy.url().should('match', /\/artigos\/\d+/);
  });
});
