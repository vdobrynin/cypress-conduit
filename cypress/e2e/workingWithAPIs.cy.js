/// <reference types="cypress" />

it('first test', () => {
    cy.intercept({ method: 'GET', pathname: 'tags' }, { fixture: 'tags.json' })  //--> router matcher #56
    // cy.intercept('GET', '**/tags', { fixture: 'tags.json' })                 // wild card #54.2
    cy.intercept('GET', '**/articles*', { fixture: 'articles.json' })        // wild card #54.2
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/tags', { fixture: 'tags.json' }) //#54.1 
    // cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', { fixture: 'articles.json' }) //#54.2
    cy.loginToApplication()
})

// it('modify api response', { retries: 2 }, () => {  // modifying at #64.2 to 3 attempts custom setting //#55 mocking api response
//     cy.intercept('GET', '**/articles*', req => {   // request
//         req.continue(res => {                  // request object to respond object from the server with body.articles.favoritesCount
//             res.body.articles[0].favoritesCount = 9999999 // that we are looking for 'likes' to modify
//             res.send(res.body)          // call respond one more time to send modify response 'res.body'
//         })
//     })
//     cy.loginToApplication()
//     cy.get('app-favorite-button').first().should('contain.text', '99999999') // change assertion from '9999999' to '99999999' to fail
// })

// it('modify api response', () => {        // modifying at #64.1 retries in config.js  // #55 mocking api response
//     cy.intercept('GET', '**/articles*', req => {   // request
//         req.continue(res => {                  // request object to respond object from the server with body.articles.favoritesCount
//             res.body.articles[0].favoritesCount = 9999999 // that we are looking for 'likes' to modify
//             res.send(res.body)          // call respond one more time to send modify response 'res.body'
//         })
//     })
//     cy.loginToApplication()
//     cy.get('app-favorite-button').first().should('contain.text', '99999999') // change assertion from '9999999' to '99999999' to fail
// })

it('modify api response', () => {               // commented at #64  // #55 mocking api response
    cy.intercept('GET', '**/articles*', req => {   // request
        req.continue(res => {                  // request object to respond object from the server with body.articles.favoritesCount
            res.body.articles[0].favoritesCount = 9999999 // that we are looking for 'likes' to modify
            res.send(res.body)          // call respond one more time to send modify response 'res.body'
        })
    })
    cy.loginToApplication()
    cy.get('app-favorite-button').first().should('contain.text', '9999999') // assertion
})

it('waiting the browser api calls', () => {                    // dynamically wait for data         
    cy.intercept('GET', '**/articles*').as('artcileApiCall')    // waiting for browser api calls #57.2
    cy.loginToApplication()                                         // #57.1
    // cy.wait('@artcileApiCall')                               // call alias for all articles loads #57.2 'simple'
    cy.wait('@artcileApiCall').then(apiArticleObject => {           // call alias for all articles loads #57.3
        console.log(apiArticleObject)
        expect(apiArticleObject.response.body.articles[0].title).to.contain('Bondar Academy')
    })
    // cy.get('app-article-list').should('contain.text', 'Bondar Academy')     // scenario #1 --> NOT Preferable #57.1
    cy.get('app-article-list').invoke('text').then(allArticleTexts => {     // scenario #2 #57.2
        expect(allArticleTexts).to.contain('Bondar Academy')
    })
})

// it('delete article-1', () => {                       // create, then delete article #59
//     cy.request({                                                       // 1st request using object #59.1
//         url: 'https://conduit-api.bondaracademy.com/api/users/login',
//         method: 'POST',
//         body: {
//             "user": {
//                 "email": "pwtest60@test.com",
//                 "password": "vd12345"
//             }
//         }
//     }).then(response => {                                       // 1st response #59.1
//         expect(response.status).to.equal(200)                       // validate status should be 200 creating article
//         const accessToken = 'Token ' + response.body.user.token             // assessed to the token
//         cy.request({                                                                // 2nd request with Token #59.1
//             url: 'https://conduit-api.bondaracademy.com/api/articles/',
//             method: 'POST',
//             body: {
//                 "article": {
//                     "title": "Test Title Cypress",
//                     "description": "This is description",
//                     "body": "body",
//                     "tagList": []
//                 }
//             },
//             headers: { 'Authorization': accessToken }        // 4th property that we need 
//         }).then(response => {                                       // 2nd response
//             expect(response.status).to.equal(201)                           // status should be 201                      
//             expect(response.body.article.title).to.equal('Test Title Cypress')     // title validation
//         })
//     })
//     cy.loginToApplication()
//     cy.contains('Test Title Cypress').click()
//     cy.intercept('GET', '**/articles*').as('artcileApiCall')   // to fix false negative assertion to wait (see below)
//     cy.contains('button', 'Delete Article').first().click()                                     // delete article
//     cy.wait('@artcileApiCall')                                          // wait to articles loading    
//     cy.get('app-article-list').should('not.contain.text', 'Test Title Cypress')                 // validation
// })

it('delete article-2', () => {                       // create, then delete article #59    //--> make changes at #61 see 'delete article-1'
    cy.loginToApplication()                         // move from below to create alias '@accessToken'
    cy.get('@accessToken').then(accessToken => {                     // 1st response #59.1      //--> make changes at #61 see 'delete article-1'
        // expect(response.status).to.equal(200)        // validate status should be 200 creating article // --> no need it at #61
        // const accessToken = 'Token ' + response.body.user.token             // assessed to the token // --> no need it at #61
        cy.request({                                                                // 2nd request with Token #59.1
            url: Cypress.env('apiUrl') + '/articles/',           //--> change to env at #63
            method: 'POST',
            body: {
                "article": {
                    "title": "Test Title Cypress",
                    "description": "This is description",
                    "body": "body",
                    "tagList": []
                }
            },
            headers: { 'Authorization': 'Token ' + accessToken }        // 4th property that we need //--> make changes at #61 see 'delete article-1'
        }).then(response => {                                       // 2nd response
            expect(response.status).to.equal(201)                           // status should be 201                      
            expect(response.body.article.title).to.equal('Test Title Cypress')     // title validation
        })
    })
    // cy.loginToApplication()                  move up in test
    cy.contains('Test Title Cypress').click()
    cy.intercept('GET', '**/articles*').as('artcileApiCall')   // to fix false negative assertion to wait (see below)
    cy.contains('button', 'Delete Article').first().click()                                     // delete article
    cy.wait('@artcileApiCall')                                          // wait to articles loading    
    cy.get('app-article-list').should('not.contain.text', 'Test Title Cypress')                 // validation
})

it('e2e api testing', () => {
    cy.request({                                                        // 1st request using object
        url: Cypress.env('apiUrl') + '/users/login',                //--> change to env at #63
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
            url: Cypress.env('apiUrl') + '/articles/',              //--> change to env at #63
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
            url: Cypress.env('apiUrl') + '/articles?limit=10&offset=0',         //--> change to env at #63
            method: 'GET',
            headers: { 'Authorization': accessToken }
        }).then(response => {
            expect(response.status).to.equal(200)
            cy.wait(300)
            expect(response.body.articles[0].title).to.equal('Test Title Cypress API Testing')  // validation deletion of title
            const slugID = response.body.articles[0].slug                                         // create slugID for deleting

            cy.request({                                                            // 2nd req validation slug of 1st article
                url: `${Cypress.env('apiUrl')}/articles/${slugID}`, // slugID to delete article use backticks 
                method: 'DELETE',
                headers: { 'Authorization': accessToken }
            }).then(response => {                                               // response
                expect(response.status).to.equal(204)                               // validation of deletion
            })
        })

        cy.request({                                                                 // 3d req to validation of article NOT present  
            url: Cypress.env('apiUrl') + '/articles?limit=10&offset=0',         //--> change to env at #63
            method: 'GET',
            headers: { 'Authorization': accessToken }
        }).then(response => {
            expect(response.status).to.equal(200)                               // validation
            expect(response.body.articles[0].title).to.not.equal('Test Title Cypress API Testing')
        })
    })
})