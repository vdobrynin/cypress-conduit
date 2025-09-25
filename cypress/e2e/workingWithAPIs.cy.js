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

it('waiting for apis', () => {                              // waiting for browser api calls #57
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

it.only('delete article', () => {                   // create, then delete article
    cy.request({                                                        // 1st request
        url: 'https://conduit-api.bondaracademy.com/api/users/login',
        method: 'POST',
        body: {
            "user": {
                "email": "pwtest60@test.com",
                "password": "vd12345"
            }
        }
    }).then(response => {                                           // 1st response
        expect(response.status).to.equal(200)
        const accessToken = 'Token ' + response.body.user.token

        cy.request({                                                    // 2nd request with Token
            url: 'https://conduit-api.bondaracademy.com/api/articles/',
            method: 'POST',
            body: {
                "article": {
                    "title": "Test title Cypress",
                    "description": "Some description",
                    "body": "This is a body",
                    "tagList": []
                }
            },
            headers: { 'Authorization': accessToken }
        }).then(response => {                                       // 2nd response
            expect(response.status).to.equal(201)                                   // status should be 201
            expect(response.body.article.title).to.equal('Test title Cypress')     // status title validation
        })
    })

    cy.loginToApplication()
    cy.contains('Test title Cypress').click()
    cy.intercept('GET', '**/articles*').as('artcileApiCall')         // to fix false negative assertion
    cy.contains('button', 'Delete Article').first().click()                                     // delete article
    cy.wait('@artcileApiCall')                                          // wait to articles loading    
    cy.get('app-article-list').should('not.contain.text', 'Test title Cypress')                 // validation
})