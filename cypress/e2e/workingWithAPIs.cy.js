/// <reference types="cypress" />

it('first test', () => {
    cy.intercept({ method: 'GET', pathname: 'tags' }, { fixture: 'tags.json' })  //--> router matcher #56
    // cy.intercept('GET', '**/tags', { fixture: 'tags.json' })                 // wild card #54.2
    cy.intercept('GET', '**/articles*', { fixture: 'articles.json' })        // wild card #54.2
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/tags', { fixture: 'tags.json' }) //#54.1 
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', { fixture: 'articles.json' }) //#54.2
    cy.loginToApplication()
})

it('modify api response', () => {                      // #55 mocking api response
    cy.intercept('GET', '**/articles*', req => {   // request
        req.continue(res => {                  // request object to respond object from the server with body.articles.favoritesCount
            res.body.articles[0].favoritesCount = 9999999 // that we are looking for 'likes' to modify
            res.send(res.body)          // call respond one more time to send modify response 'res.body'
        })
    })
    cy.loginToApplication()
    cy.get('app-favorite-button').first().should('contain.text', '9999999') // assertion
})

it.only('waiting the browser api calls', () => {                    // dynamically wait          
    cy.intercept('GET', '**/articles*').as('artcileApiCall')    // waiting for browser api calls #57.2
    cy.loginToApplication()                                         // #57.1
    // cy.wait('@artcileApiCall')                               // call alias for all articles loads #57.2 'simple'
    cy.wait('@artcileApiCall').then(apiArticleObject => {           // call alias for all articles loads #57.3
        console.log(apiArticleObject)
        expect(apiArticleObject.response.body.articles[0].title).to.contain('Bondar Academy')
    })
    // cy.get('app-article-list').should('contain.text', 'Bondar Academy')     // scenario #1 NOT Preferable #57.1
    cy.get('app-article-list').invoke('text').then(allArticleTexts => {     // scenario #2 #57.2
        expect(allArticleTexts).to.contain('Bondar Academy')
    })
})

it('delete article', () => {                   // create, then delete article
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
    cy.loginToApplication()
    cy.get('@accessToken').then(accessToken => {            // *** calling alias accessToken after creation in commands
        // expect(response.status).to.equal(200)                       // validate 
        // const accessToken = 'Token ' + response.body.user.token
        cy.request({                                                    // 2nd request with Token
            url: 'https://conduit-api.bondaracademy.com/api/articles/',
            method: 'POST',
            body: {
                "article": {
                    "title": "Test Title Cypress",
                    "description": "Some description",
                    "body": "This is a body",
                    "tagList": []
                }
            },
            headers: { 'Authorization': 'Token ' + accessToken }
        }).then(response => {                                       // 2nd response
            expect(response.status).to.equal(201)                                   // status should be 201
            expect(response.body.article.title).to.equal('Test Title Cypress')     // title validation
        })
    })
    
    cy.loginToApplication()
    cy.contains('Test Title Cypress').click()
    cy.intercept('GET', '**/articles*').as('artcileApiCall')   // to fix false negative assertion to wait (see below)
    cy.contains('button', 'Delete Article').first().click()                                     // delete article
    cy.wait('@artcileApiCall')                                          // wait to articles loading    
    cy.get('app-article-list').should('not.contain.text', 'Test Title Cypress')                 // validation
})

it('e2e api testing', () => {
    cy.request({                                                        // 1st request using object
        url: 'https://conduit-api.bondaracademy.com/api/users/login',
        method: 'POST',
        body: {
            "user": {
                "email": "pwtest60@test.com",
                "password": "vd12345"
            }
        }
    }).then(response => {                                           // 1st response
        expect(response.status).to.equal(200)                       // validate 
        const accessToken = 'Token ' + response.body.user.token

        cy.request({                                                    // 2nd request with Token
            url: 'https://conduit-api.bondaracademy.com/api/articles/',
            method: 'POST',
            body: {
                "article": {
                    "title": "Test Title Cypress API Testing",
                    "description": "Some description",
                    "body": "This is a body",
                    "tagList": []
                }
            },
            headers: { 'Authorization': accessToken }
        }).then(response => {                                       // 2nd response
            expect(response.status).to.equal(201)                                   // status should be 201
            expect(response.body.article.title).to.equal('Test Title Cypress API Testing')     // title validation
        })

        cy.request({                                                                   // 1st req  validation of deletion   
            url: 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
            method: 'GET',
            headers: { 'Authorization': accessToken }
        }).then(response => {
            expect(response.status).to.equal(200)
            expect(response.body.articles[0].title).to.equal('Test Title Cypress API Testing')  // validation deletion of title
            const slugID = response.body.articles[0].slug                                         // create slugID

            cy.request({                                                            // 2nd req validation slug of 1st article
                url: `https://conduit-api.bondaracademy.com/api/articles/${slugID}`, // slugID
                method: 'DELETE',
                headers: { 'Authorization': accessToken }
            }).then(response => {
                expect(response.status).to.equal(204)                               // validation of deletion
            })
        })

        cy.request({                                                                   // 3d req  validation of article NOT present  
            url: 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
            method: 'GET',
            headers: { 'Authorization': accessToken }
        }).then(response => {
            expect(response.status).to.equal(200)                               // validation
            expect(response.body.articles[0].title).to.not.equal('Test Title Cypress API Testing')
        })
    })
})