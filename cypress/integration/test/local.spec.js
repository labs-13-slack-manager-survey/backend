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
        cy.url().should('include', '/login').wait(10000)
        cy.get('button').contains('Google').click()
        // cy.go('forward')
    })
})

describe('Dashboard', ()=> {
    it('Await Tour', ()=>{
        cy.wait(1500)
    })
    it('Tour Loads', ()=>{
        cy.contains('Next')
    })
    it('Tour Functional', ()=>{
        cy.contains('Next').click()
        cy.wait(1000).contains('Next').click()
        cy.wait(1000).contains('Next').click()
        cy.wait(1000).contains('Next').click()
        cy.wait(1000).contains('Done').click()
    })
})