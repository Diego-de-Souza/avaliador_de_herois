describe('Client Area Dashboard', () => {
  beforeEach(() => {
    // Assuming user is logged in
    cy.login('test@example.com', 'password123');
    cy.visit('/webmain/client-area');
  });

  it('should display dashboard with navigation options', () => {
    cy.get('app-client-dashboard').should('be.visible');
    cy.contains(/artigos|notícias|faq|sac/i).should('exist');
  });

  it('should navigate to articles page', () => {
    cy.contains(/artigos/i).click();
    cy.url().should('include', '/client-area/articles');
  });

  it('should navigate to news page', () => {
    cy.contains(/notícias/i).click();
    cy.url().should('include', '/client-area/news');
  });

  it('should navigate to FAQ page', () => {
    cy.contains(/faq/i).click();
    cy.url().should('include', '/client-area/faq');
  });

  it('should navigate to SAC page', () => {
    cy.contains(/sac|suporte/i).click();
    cy.url().should('include', '/client-area/sac');
  });
});
