/// <reference types="cypress" />

it('first test', () => {
    cy.intercept({ method: 'GET', pathname: 'tags' }, { fixture: 'tags.json' })  //router matcher #56
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/tags', { fixture: 'tags.json' }) // #54 
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', { fixture: 'articles.json' }) // #54
    // cy.intercept('GET', '**/tags', { fixture: 'tags.json' })                 // wild card #54
    cy.intercept('GET', '**/articles*', { fixture: 'articles.json' })        // wild card #54
    cy.loginToApplication()
})

it('modify api response', () => {                      // #55 mocking api response
    cy.intercept('GET', '**/articles*', req => {
        req.continue(res => {
            res.body.articles[0].favoritesCount = 9999999
            res.send(res.body)
        })
    })
    cy.loginToApplication()
    cy.get('app-favorite-button').first().should('contain.text', '9999999')
})

it.only('waiting for apis', () => {                              // waiting for browser api calls #57
    cy.intercept('GET', '**/articles*').as('artcileApiCall')
    cy.loginToApplication()
    // cy.wait('@artcileApiCall')                               // call alias for all articles loads
    cy.wait('@artcileApiCall').then(apiArticleObject => {           // call alias for all articles loads
        console.log(apiArticleObject)
        expect(apiArticleObject.response.body.articles[0].title).to.contain('Bondar Academy')
    })
    // cy.get('app-article-list').should('contain.text', 'Bondar Academy')     // scenario #1 NOT preferable
    cy.get('app-article-list').invoke('text').then(allArticleTexts => {     // scenario #2
        expect(allArticleTexts).to.contain('Bondar Academy')
    })
})