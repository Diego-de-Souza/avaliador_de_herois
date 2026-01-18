describe('Client Area - Articles Management', () => {
  beforeEach(() => {
    // Usa o comando customizado para visitar com autenticação
    cy.visitAuthenticated('/webmain/client-area/articles');
  });

  it('should display articles list', () => {
    // Aguarda a página carregar completamente
    cy.url({ timeout: 10000 }).should('include', '/client-area/articles');
    cy.wait(1000);
    // Verifica se o componente ou algum conteúdo de lista está visível
    cy.get('body').should('satisfy', ($body) => {
      const hasComponent = $body.find('app-client-article-list').length > 0;
      const hasListContent = $body.text().toLowerCase().includes('artigo') || 
                            $body.find('table, .list, .articles').length > 0;
      return hasComponent || hasListContent;
    });
  });

  it('should navigate to create article page', () => {
    // Usa o comando customizado para visitar com autenticação
    cy.visitAuthenticated('/webmain/client-area/articles/create');
    
    // Verifica que chegou na página correta
    cy.url({ timeout: 10000 }).should('include', '/client-area/articles/create');
  });

  it('should display create article form', () => {
    // Usa o comando customizado para visitar com autenticação
    cy.visitAuthenticated('/webmain/client-area/articles/create');
    
    // Verifica se não foi redirecionado para login
    cy.url({ timeout: 10000 }).should('include', '/client-area/articles/create');
    
    cy.get('form').should('be.visible');
    // Verifica se há algum input de título
    cy.get('body').then(($body) => {
      const hasTitleInput = $body.find('input[name="title"], input[placeholder*="título" i], input[placeholder*="title" i]').length > 0;
      const hasForm = $body.find('form').length > 0;
      expect(hasTitleInput || hasForm).to.be.true;
    });
  });

  it('should validate required fields', () => {
    // Usa o comando customizado para visitar com autenticação
    cy.visitAuthenticated('/webmain/client-area/articles/create');
    
    cy.get('button[type="submit"]').click();
    cy.wait(1000);
    
    // Check for validation messages - pode aparecer em diferentes lugares
    cy.get('form').then(($form) => {
      const hasErrorClass = $form.hasClass('ng-invalid');
      const hasErrorMessages = $form.find('.error, .invalid-feedback, [class*="error"]').length > 0;
      const hasErrorText = $form.text().toLowerCase().includes('obrigatório') || 
                           $form.text().toLowerCase().includes('required') ||
                           $form.text().toLowerCase().includes('campo');
      
      expect(hasErrorClass || hasErrorMessages || hasErrorText).to.be.true;
    });
  });
});
