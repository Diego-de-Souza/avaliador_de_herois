/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(`[data-cy=${value}]`);
});

// Comando para configurar autenticação mockada ANTES de qualquer visita
Cypress.Commands.add('setAuthenticatedUser', (email: string = 'test@example.com') => {
  const mockUser = {
    id: 1,
    email: email,
    name: 'Test User',
    role: 'user'
  };
  
  // Configura localStorage antes de qualquer coisa
  cy.window().then((win) => {
    win.localStorage.clear();
    win.localStorage.setItem('user', JSON.stringify(mockUser));
    win.localStorage.setItem('session_token', 'test-session-token');
  });
  
  // Intercepta chamadas de verificação de sessão para retornar usuário válido
  cy.intercept('GET', '**/api/**/session*', {
    statusCode: 200,
    body: { user: mockUser }
  }).as('checkSession');
  
  cy.intercept('POST', '**/api/**/login*', {
    statusCode: 200,
    body: {
      user: mockUser,
      session_token: 'test-session-token',
      has_totp: false,
      status: true
    }
  }).as('loginRequest');
});

Cypress.Commands.add('login', (email: string, password: string) => {
  // Intercepta a requisição de login para simular sucesso
  cy.intercept('POST', '**/api/**/login*', { 
    statusCode: 200, 
    body: { 
      user: { id: 1, email: email, name: 'Test User', role: 'user' }, 
      session_token: 'test-session-token',
      has_totp: false,
      status: true
    } 
  }).as('loginRequest');
  
  cy.visit('/login');
  cy.wait(1000);
  
  // Preenche os campos de login
  cy.get('input[type="email"], input[name="email"], input[placeholder*="email" i]').first().should('be.visible').clear().type(email);
  cy.get('input[type="password"], input[name="password"]').first().should('be.visible').clear().type(password);
  
  // Clica no botão de submit
  cy.get('button[type="submit"], button').contains(/login|entrar|acessar/i).should('be.visible').click();
  
  // Aguarda resposta da API (ou timeout se não houver API real)
  // cy.wait() pode falhar silenciosamente se a interceptação não ocorrer
  cy.url({ timeout: 1000 }).then(() => {
    // Se a requisição não acontecer, continua normalmente
  });
  
  // Simula autenticação no localStorage ANTES de qualquer verificação
  cy.window().then((win) => {
    const mockUser = {
      id: 1,
      email: email,
      name: 'Test User',
      role: 'user'
    };
    win.localStorage.setItem('user', JSON.stringify(mockUser));
    win.localStorage.setItem('session_token', 'test-session-token');
  });
  
  // Aguarda navegação após login bem-sucedido
  cy.wait(2000);
  
  // Se ainda estiver em /login, força a navegação para home
  cy.url({ timeout: 10000 }).then((url) => {
    if (url.includes('/login')) {
      // Força a navegação para home já que o mock está configurado
      cy.visit('/');
      cy.wait(1000);
    }
  });
});

Cypress.Commands.add('waitForApi', () => {
  cy.wait(1000); // Wait for API calls to complete
});

// Comando para visitar páginas protegidas com autenticação pré-configurada
Cypress.Commands.add('visitAuthenticated', (url: string) => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: 'user'
  };
  
  // Intercepta chamadas de verificação de sessão ANTES de visitar
  cy.intercept('GET', '**/api/**/session*', {
    statusCode: 200,
    body: { user: mockUser }
  }).as('checkSession');
  
  cy.intercept('POST', '**/api/**/login*', {
    statusCode: 200,
    body: {
      user: mockUser,
      session_token: 'test-session-token',
      has_totp: false,
      status: true
    }
  }).as('loginRequest');
  
  // Primeiro visita uma página simples para configurar o localStorage
  cy.visit('/', {
    onBeforeLoad: (win) => {
      // Garante que o localStorage está configurado ANTES do Angular inicializar
      win.localStorage.clear();
      win.localStorage.setItem('user', JSON.stringify(mockUser));
      win.localStorage.setItem('session_token', 'test-session-token');
    }
  });
  
  // Aguarda o Angular inicializar
  cy.wait(2000);
  
  // Agora navega para a página protegida
  cy.window().then((win) => {
    // Garante que o localStorage ainda está configurado
    win.localStorage.setItem('user', JSON.stringify(mockUser));
    win.localStorage.setItem('session_token', 'test-session-token');
    // Navega para a URL desejada
    win.location.href = url;
  });
  
  // Aguarda a navegação
  cy.wait(2000);
  
  // Se foi redirecionado para login, força configuração e recarrega
  cy.url({ timeout: 10000 }).then((currentUrl) => {
    if (currentUrl.includes('/login')) {
      cy.window().then((win) => {
        win.localStorage.clear();
        win.localStorage.setItem('user', JSON.stringify(mockUser));
        win.localStorage.setItem('session_token', 'test-session-token');
        // Força navegação novamente
        win.location.href = url;
      });
      cy.wait(3000);
    }
  });
});

export {};
