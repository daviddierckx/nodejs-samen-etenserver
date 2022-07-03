require('dotenv').config({ path: __dirname + '/./../.env' })

module.exports = {
    database: {
        address: process.env.DATABASE_ADDRESS,
        port: process.env.DATABASE_PORT,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE,
    },
    auth: {
        secret: process.env.AUTH_SECRET,
    }
}
