const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

module.exports = {
    database: {
        address: process.env.DATABASE_ADDRESS,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE,
    },
    auth: {
        secret: process.env.AUTH_SECRET,
    }
}