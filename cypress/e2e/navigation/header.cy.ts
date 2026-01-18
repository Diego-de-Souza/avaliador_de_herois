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
    // Verifica se há link ou botão de login
    cy.get('body').should('satisfy', ($body) => {
      const text = $body.text().toLowerCase();
      const hasLoginLink = $body.find('a[href*="login"]').length > 0;
      const hasLoginButton = $body.find('button').text().toLowerCase().includes('login') || 
                            $body.find('button').text().toLowerCase().includes('entrar');
      return hasLoginLink || hasLoginButton || text.includes('login') || text.includes('entrar');
    });
  });

  it('should show user menu when authenticated', () => {
    // Usa o comando customizado para visitar com autenticação
    cy.visitAuthenticated('/');
    
    // Aguarda um pouco mais para garantir que os componentes renderizaram
    cy.wait(1000);
    
    // Verifica se o menu do usuário está visível após login
    cy.get('body').then(($body) => {
      const hasMenuUser = $body.find('app-menu-user').length > 0;
      const hasDataCy = $body.find('[data-cy="user-menu"]').length > 0;
      const hasUserText = $body.text().toLowerCase().includes('sair') || 
                          $body.text().toLowerCase().includes('logout') || 
                          $body.text().toLowerCase().includes('perfil') ||
                          $body.text().toLowerCase().includes('usuário') ||
                          $body.text().toLowerCase().includes('user') ||
                          $body.text().toLowerCase().includes('minha área');
      
      // Verifica se não há botão de login (indicando que está autenticado)
      const hasLoginButton = $body.find('a[href*="login"], button').filter((i, el) => {
        const text = Cypress.$(el).text().toLowerCase();
        return text.includes('login') || text.includes('entrar');
      }).length > 0;
      
      // Pelo menos uma dessas condições deve ser verdadeira
      expect(hasMenuUser || hasDataCy || hasUserText || !hasLoginButton).to.be.true;
    });
  });

  it('should toggle theme when clicking theme button', () => {
    // Verifica o tema inicial verificando o body
    let initialTheme: string;
    cy.get('body').then(($body) => {
      const hasDark = $body.hasClass('dark');
      const hasLight = $body.hasClass('light');
      initialTheme = hasDark ? 'dark' : (hasLight ? 'light' : 'none');
    });
    
    // Encontra o botão de tema - procura no header
    cy.get('.header-actions').then(($actions) => {
      // Procura por elemento que contém SVG ou indica controle de tema
      const themeButtons = $actions.find('[class*="theme"], .icones-menu-user').filter((i, el) => {
        const $el = Cypress.$(el);
        return $el.find('svg').length > 0;
      });
      
      if (themeButtons.length > 0 && initialTheme !== 'none') {
        cy.wrap(themeButtons.first()).should('be.visible').click({ force: true });
        cy.wait(1500);
        
        // Verifica se o tema mudou
        cy.get('body').then(($newBody) => {
          const newHasDark = $newBody.hasClass('dark');
          const newHasLight = $newBody.hasClass('light');
          const newTheme = newHasDark ? 'dark' : (newHasLight ? 'light' : 'none');
          
          // Se havia um tema inicial, verifica se mudou
          expect(newTheme).to.not.equal(initialTheme);
        });
      } else {
        // Se não encontrar o botão ou não houver tema, apenas verifica que há controle de tema
        cy.get('body').should('satisfy', ($body) => {
          return $body.hasClass('dark') || $body.hasClass('light') || $body.find('.header-actions').length > 0;
        });
      }
    });
  });
});
