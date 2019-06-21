describe('Login', () => {
    it('Site Alive' ,() =>{
        cy.visit('https://slackrs-app.netlify.com/')
    })
})

describe('Login', () => {
    it('Can Get Past Landing Page' ,() =>{
        cy.visit('https://slackrs-app.netlify.com/')
        cy.get('button').click({ multiple: true , force: true})     
    })
    it('Can Log In', () =>{
        cy.url().should('include', '/login')
        cy.get('button').contains('Google').click()
        // cy.go('forward')
    })
})
