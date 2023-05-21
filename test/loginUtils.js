// loginUtils.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

async function loginUser() {
    return new Promise((resolve, reject) => {
        chai
            .request(server)
            .post('/api/login')
            .send({ email_address: 'user@hotmail.com', password: 'User@1234' })
            .end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.body.token);
                }
            });
    });
}

module.exports = {
    loginUser,
};
