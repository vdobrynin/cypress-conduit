const { defineConfig } = require("cypress"); // #63.4

module.exports = defineConfig({
    env: {                            // #63
        username: 'pwtest60DEV@test.com',
        password: 'vd12345DEV',
        apiUrl: 'https://conduit-api.bondaracademy.com/api'
    },
    e2e: {
        baseUrl: 'https://conduit.bondaracademy.com/',
        setupNodeEvents(on, config) {
            config.env.username = process.env.USER_NAME,
                config.env.password = process.env.PASSWORD
            return config
        },
    },
    viewportWidth: 2065,
    viewportHeight: 1329,
    video: false,
});
