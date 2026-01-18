describe('Client Area Dashboard', () => {
  beforeEach(() => {
    // Usa o comando customizado para visitar com autenticação
    cy.visitAuthenticated('/webmain/client-area');
  });

  it('should display dashboard with navigation options', () => {
    // Aguarda o componente carregar
    cy.get('body').should('be.visible');
    // Verifica se está na página correta
    cy.url({ timeout: 10000 }).should('include', '/client-area');
    // Verifica se o dashboard está visível ou se há algum conteúdo da área do cliente
    cy.get('body').should('satisfy', ($body) => {
      const hasDashboard = $body.find('app-client-dashboard').length > 0;
      const hasClientAreaContent = $body.text().toLowerCase().includes('artigos') || 
                                   $body.text().toLowerCase().includes('notícias') ||
                                   $body.text().toLowerCase().includes('faq') ||
                                   $body.text().toLowerCase().includes('sac') ||
                                   $body.text().toLowerCase().includes('minha área');
      return hasDashboard || hasClientAreaContent;
    });
  });

  it('should navigate to articles page', () => {
    cy.contains(/artigos/i).should('be.visible').click({ force: true });
    cy.wait(1000);
    cy.url({ timeout: 10000 }).should('include', '/client-area/articles');
  });

  it('should navigate to news page', () => {
    cy.contains(/notícias|news/i).should('be.visible').click({ force: true });
    cy.wait(1000);
    cy.url({ timeout: 10000 }).should('include', '/client-area/news');
  });

  it('should navigate to FAQ page', () => {
    cy.contains(/faq/i).should('be.visible').click({ force: true });
    cy.wait(1000);
    cy.url({ timeout: 10000 }).should('include', '/client-area/faq');
  });

  it('should navigate to SAC page', () => {
    cy.contains(/sac|suporte|atendimento/i).should('be.visible').click({ force: true });
    cy.wait(1000);
    cy.url({ timeout: 10000 }).should('include', '/client-area/sac');
  });
});
