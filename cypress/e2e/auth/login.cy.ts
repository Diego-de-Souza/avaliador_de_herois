describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('form').should('be.visible');
    cy.get('input[type="email"], input[name="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();
    // Check for validation messages
    cy.get('form').should('contain', 'obrigatório');
  });

  it('should navigate to home after successful login', () => {
    const email = 'test@example.com';
    const password = 'password123';
    
    cy.login(email, password);
    cy.url().should('not.include', '/login');
  });

  it('should show error message for invalid credentials', () => {
    cy.get('input[type="email"], input[name="email"]').type('invalid@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Wait for error message
    cy.wait(2000);
    // Check for error message (adjust selector based on your implementation)
    cy.get('body').should('contain.text', 'erro');
  });

  it('should have Google login button', () => {
    cy.get('button').contains(/google/i).should('exist');
  });
});
