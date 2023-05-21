require('dotenv').config({ path: __dirname + '/./../.env' })

module.exports = {
    database: {
        address: process.env.DATABASE_ADDRESS,
        port: process.env.DATABASE_PORT,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE,
    },
    testDatabase: {
        address: process.env.TEST_DATABASE_ADDRESS,
        port: process.env.TEST_DATABASE_PORT,
        username: process.env.TEST_DATABASE_USERNAME,
        password: process.env.TEST_DATABASE_PASSWORD,
        database: process.env.TEST_DATABASE_DATABASE,
    },
    auth: {
        secret: process.env.AUTH_SECRET,
    }
}
