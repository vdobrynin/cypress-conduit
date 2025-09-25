/// <reference types="cypress" />

it('first test', () => {
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/tags', { fixture: 'tags.json' }) // #54 
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', { fixture: 'articles.json' }) // #54
    cy.intercept('GET', '**/tags', { fixture: 'tags.json' })                 // wild card #54
    cy.intercept('GET', '**/articles*', { fixture: 'articles.json' })        // wild card #54
    cy.loginToApplication()
})

it.only('modify api response', () => {                      // #55 mocking api response
    cy.intercept('GET', '**/articles*', req => {
        req.continue(res => {
            res.body.articles[0].favoritesCount = 9999999
            res.send(res.body)
        })
    })
    cy.loginToApplication()
    cy.get('app-favorite-button').first().should('contain.text', '9999999')
})