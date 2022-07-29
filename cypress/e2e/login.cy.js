describe('Login', () => {
    beforeEach(() => {
        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from failing the test
            return false
        })
    })
    it('Should fail to login', () => {
        cy.visit('http://localhost:3000')
        cy.get('input[name=email]')
            .type('fede.mz@gmail.com');
        cy.get('input[name=password]')
            .type('password2');
        cy.get('button')
            .contains('Login')
            .click();

        cy.get('.alert-danger')
            .should('be.visible');
        cy.screenshot();
    });

});