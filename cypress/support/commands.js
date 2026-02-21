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
    cy.request({                    //#63 environment variables --> replace below login // 1st request using object
        url: Cypress.env('apiUrl') + '/users/login',
        method: 'POST',
        body: {
            "user": {
                "email": Cypress.env('username'),
                "password": Cypress.env('password')
            }
        }
    }).then(response => {                                           // 1st response
        expect(response.status).to.equal(200)                       // validate 
        const accessToken = response.body.user.token
        cy.wrap(accessToken).as('accessToken')
        cy.visit('/', {
            onBeforeLoad(win) {                                     // call window object
                win.localStorage.setItem('jwtToken', accessToken)    // inside window object -> call local storage pass JWT token
            }
        })
    })

    // cy.request({                                               // #61 replace below login // 1st request using object
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
    //         onBeforeLoad(win) {                                     // call window object
    //             win.localStorage.setItem('jwtToken', accessToken)    // inside window object -> call local storage pass JWT token
    //         }
    //     })
    // })

    // cy.visit('/')              // --> #53 we modified login below   //at #51 during review 
    // cy.contains('Sign in').click()
    // cy.get('[placeholder="Email"]').type('pwtest60@test.com')
    // cy.get('[placeholder="Password"]').type('vd12345')
    // cy.contains('form', 'Sign in').submit()
})