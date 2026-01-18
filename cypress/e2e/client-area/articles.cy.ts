describe('Client Area - Articles Management', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123');
    cy.visit('/webmain/client-area/articles');
  });

  it('should display articles list', () => {
    cy.get('app-client-article-list').should('be.visible');
  });

  it('should navigate to create article page', () => {
    cy.contains(/criar|novo/i).click();
    cy.url().should('include', '/client-area/articles/create');
  });

  it('should display create article form', () => {
    cy.visit('/webmain/client-area/articles/create');
    cy.get('form').should('be.visible');
    cy.get('input[name="title"], input[placeholder*="título" i]').should('exist');
    cy.get('textarea[name="description"], textarea[placeholder*="descrição" i]').should('exist');
  });

  it('should validate required fields', () => {
    cy.visit('/webmain/client-area/articles/create');
    cy.get('button[type="submit"]').click();
    // Check for validation messages
    cy.get('form').should('contain', 'obrigatório');
  });
});
