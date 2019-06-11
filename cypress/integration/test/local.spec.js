describe('Site Live', function() {
    it('Is Alive?', function() {
    cy.visit('http://localhost:3000/')
    })
    })

describe('Login', () => {
    it('Can Get Past Landing Page' ,() =>{
        cy.visit('http://localhost:3000/')
        cy.get('button').click({ multiple: true , force: true})     
    })
    it('Can Log In', () =>{
        cy.url().should('include', '/login')
        cy.get('button').contains('Google').click()
        // cy.go('forward')
    })
})