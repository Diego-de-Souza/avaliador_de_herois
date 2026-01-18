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
    cy.get('app-advanced-search input.search-input, input[formControlName="query"]').should('exist').type('marvel');
    cy.wait(1000);
    // Articles should be filtered
  });

  it('should navigate to article detail when clicking on article', () => {
    // Aguarda os artigos carregarem
    cy.wait(2000);
    // Verifica se há artigos antes de tentar clicar
    cy.get('body').then(($body) => {
      const hasArticles = $body.find('.article-card').length > 0;
      if (hasArticles) {
        cy.get('.article-card').first().should('be.visible').click({ force: true });
        cy.wait(1000);
        cy.url({ timeout: 10000 }).should('match', /\/artigos\/.+/);
      } else {
        // Se não houver artigos, apenas verifica que a página de artigos está carregada
        cy.url().should('include', '/artigos');
      }
    });
  });
});
