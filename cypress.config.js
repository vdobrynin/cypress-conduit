const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    userName: 'pwtest60@test.com',
    password: 'vd12345',
    apiUrl: 'https://conduit-api.bondaracademy.com/api'
  },
  e2e: {
    baseUrl: 'https://conduit.bondaracademy.com/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  viewportWidth: 2065,
  viewportHeight: 1329,
  video: false,
});
