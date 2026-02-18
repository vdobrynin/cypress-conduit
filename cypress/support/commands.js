// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('loginToApplication', () => {
    // cy.request({                                                        // 1st request using object
    //     url: 'https://conduit-api.bondaracademy.com/api/users/login',
    //     method: 'POST',
    //     body: {
    //         "user": {
    //             "email": "pwtest60@test.com",
    //             "password": "vd12345"
    //         }
    //     }
    // }).then(response => {                                           // 1st response
    //     expect(response.status).to.equal(200)                       // validate 
    //     const accessToken = response.body.user.token
    //     cy.wrap(accessToken).as('accessToken')
    //     cy.visit('/', {
    //         onBeforeLoad(win) {
    //             win.localStorage.setItem('jwtToken',accessToken)
    //         }
    //     })
    // }) 
    cy.visit('/')              // --> #53 we modified login below   //at #37 during review 1st time, then at #51 2nd time
    cy.contains('Sign in').click()
    cy.get('[placeholder="Email"]').type('pwtest60@test.com')
    cy.get('[placeholder="Password"]').type('vd12345')
    cy.contains('form', 'Sign in').submit()
})