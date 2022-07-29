describe('Home structure', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
        cy.get('input[name=email]').type('fede.mz@gmail.com');
        cy.get('input[name=password]').type('password1');
        cy.get('button').contains('Login').click();
    })

    it('Money Tracker structure', () => {
        cy.get('.navbar-nav button')
            .contains('Logout')
            .should('be.visible');

        cy.contains('Accounts')
            .should('be.visible');
        cy.contains('Outcomes')
            .should('be.visible');

        cy.get('svg.recharts-surface')
            .should('be.visible');

        cy.get('.cash-flow-detail')
            .find('.row')
            .its('length')
            .should('be.gt', 1);

        cy.screenshot();
    });

    it('Cash Flow Creation', () => {

        cy.get('.cash-flow-detail')
            .find('.row')
            .its('length')
            .then((cashFlowCount) => {
                cy.get('.modal-content')
                    .should('not.exist');

                cy.get('.fa-plus-circle')
                    .parent()
                    .click();

                cy.get('.modal-content')
                    .should('be.visible');

                // account selection fails...
                cy.get('label')
                    .contains('Account')
                    .siblings('div.invalid-feedback')
                    .should('not.be.visible');

                cy.get('label')
                    .contains('Account')
                    .siblings('div')
                    .first()
                    .type('CreditCard{enter}');

                cy.get('label')
                    .contains('Account')
                    .siblings('div.invalid-feedback')
                    .should('be.visible');

                // account selection success
                cy.get('label')
                    .contains('Account')
                    .siblings('div')
                    .first()
                    .type('Efectivo{enter}');

                cy.get('label')
                    .contains('Account')
                    .siblings('div.invalid-feedback')
                    .should('not.be.visible');

                // other values
                cy.get('label')
                    .contains('Category')
                    .siblings('div')
                    .first()
                    .type('Mercado{enter}');

                cy.get('input[name=amount]')
                    .type('10.50')

                cy.get('button')
                    .contains('Save')
                    .click();

                cy.wait(1000);

                cy.get('.cash-flow-detail')
                    .find('.row')
                    .should('have.length', cashFlowCount + 1);

                cy.screenshot();
            })
    });


});