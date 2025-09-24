/// <reference types="cypress" />

it('first test', () => {
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/tags', { fixture: 'tags.json' }) // #54 
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', { fixture: 'articles.json' }) // #54
    cy.intercept('GET', '**/tags', { fixture: 'tags.json' })                 // wild card #54
    cy.intercept('GET', '**/articles*', { fixture: 'articles.json' })        // wild card #54
    cy.loginToApplication()
})