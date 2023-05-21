process.env['DB_DATABASE'] = process.env.DB_DATABASE || 'shareameal-testdb';

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const dbconnection = require('../../app/dao/database');
const mysql = require('mysql');
const config = require('../../app/config');
const { loginToken } = require('./user.test');

const jwt = require('jsonwebtoken');
require('tracer').setLevel('error');
const { log } = require('console');

chai.should();
chai.use(chaiHttp);
const { loginUser } = require('../loginUtils');
let login


dbconnection.con = mysql.createConnection({
    host: config.testDatabase.address,
    port: config.testDatabase.port,
    user: config.testDatabase.username,
    password: config.testDatabase.password,
    database: config.testDatabase.database,
});
const testConnection = mysql.createConnection({
    host: config.testDatabase.address,
    port: config.testDatabase.port,
    user: config.testDatabase.username,
    password: config.testDatabase.password,
    database: config.testDatabase.database,
});






let token;
let mealId;

let gebruikerId;


describe('Meal API', function () {
    this.beforeAll((done) => {
        testConnection.connect((err) => {
            if (err) {
                throw err;
            }
            chai
                .request(server)
                .post('/api/user')
                .send({
                    firstname: "David",
                    lastname: "Dierckx",
                    isActive: 1,
                    emailAddress: "user@hotmail.com",
                    password: "User@1234",
                    phoneNumber: "0498367874",
                    roles: "editor,guest",
                    street: "zwaluw",
                    city: "req"
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').to.be.equal(201);
                    res.body.should.have.property('success').to.be.true;
                    res.body.should.have.property('message').to.be.equal('Gebruiker succesvol geregistreerd');


                    token = res.body.data.token
                    gebruikerId = res.body.data.user_id
                    console.log("TOKENNNN MEAL" + token);
                    done()
                });
        });

    });



    after((done) => {
        // Close the test database connection
        testConnection.end((err) => {
            if (err) {
                console.error('Failed to close the test database connection:', err);
                done(err);
            } else {
                console.log('Closed the test database connection');
                done();
            }
        });
    });


    // UC-301 Toevoegen van maaltijd
    describe('UC-301 Toevoegen van maaltijd', function () {
        it('TC-301-1 - Verplicht veld ontbreekt', (done) => {
            chai
                .request(server)
                .post('/api/meal/')
                .set('Authorization', 'Bearer ' + token)
                .send({ isActive: 1 }) // Empty request body to simulate missing required fields
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').to.equal(400);
                    res.body.should.have.property('success').to.equal(false);
                    res.body.should.have.property('message').to.be.a('string');
                    res.body.should.have.property('data').to.be.an('object');
                    done();
                });
        });
        it('TC-301-2 - Niet ingelogd', (done) => {
            chai
                .request(server)
                .post('/api/meal')
                .send({}) // Request body with required fields
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').to.equal(401);
                    res.body.should.have.property('success').to.equal(false);
                    res.body.should.have.property('message').to.be.a('string');
                    res.body.should.have.property('data').to.be.an('object');
                    done();
                });
        });

        it('TC-301-3 - Maaltijd succesvol toegevoegd', (done) => {
            chai
                .request(server)
                .post('/api/meal')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    isActive: 1,
                    isVega: 0,
                    isVegan: 0,
                    isToTakeHome: 1,
                    dateTime: "2023-05-18 17:00:00",
                    maxAmountOfParticipants: 1,
                    price: 13,
                    imageUrl: "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                    updateDate: "2023-05-26 12:33:51.000000",
                    name: "Pasta Bolognese met tomaat, spekjes en kaas",
                    description: "Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!",
                    allergenes: "gluten,lactose"
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.should.have.property('success').to.equal(true);
                    res.body.should.have.property('message').to.be.a('string');
                    res.body.should.have.property('data').to.be.an('object');
                    mealId = res.body.data.id
                    done();
                });
        });
    });
    // UC-302 Wijzigen van maaltijdsgegevens
    describe('UC-302 Wijzigen van maaltijdsgegevens', function () {
        it('TC-302-1 - Verplichte velden ontbreken', (done) => {
            chai
                .request(server)
                .put('/api/meal/1')
                .set('Authorization', 'Bearer ' + token)
                .send({}) // Empty request body to simulate missing required fields
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').to.equal(400);
                    res.body.should.have.property('success').to.equal(false);
                    res.body.should.have.property('message').to.be.a('string');
                    res.body.should.have.property('data').to.be.an('object');
                    done();
                });
        });

        it('TC-302-2 - Niet ingelogd', (done) => {
            chai
                .request(server)
                .put('/api/meal/:id')
                .send({}) // Request body with required fields
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').to.equal(401);
                    res.body.should.have.property('success').to.equal(false);
                    res.body.should.have.property('message').to.be.a('string');
                    res.body.should.have.property('data').to.be.an('object');
                    done();
                });
        });
        it('TC-302-3 Niet de eigenaar van de data', (done) => {
            const updatedData = {
                isActive: 1,
                isVega: 0,
                isVegan: 0,
                isToTakeHome: 1,
                dateTime: "2023-05-18 17:00:00",
                maxAmountOfParticipants: 1,
                price: 13,
                imageUrl: "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                updateDate: "2023-05-26 12:33:51.000000",
                name: "Pasta Bolognese met tomaat, spekjes en kaas",
                description: "Test",
                allergenes: "Test"
            };

            chai.request(server)
                .put(`/api/meal/1`)
                .set('Authorization', 'Bearer ' + token)
                .send(updatedData)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').to.equal(403);
                    res.body.should.have.property('success').to.equal(false);
                    done();
                });
        });
        it('TC-302-4 Maaltijd bestaat niet', (done) => {
            const updatedData = {
                isActive: 1,
                isVega: 0,
                isVegan: 0,
                isToTakeHome: 1,
                dateTime: "2023-05-18 17:00:00",
                maxAmountOfParticipants: 1,
                price: 13,
                imageUrl: "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                updateDate: "2023-05-26 12:33:51.000000",
                name: "Pasta Bolognese met tomaat, spekjes en kaas",
                description: "Test",
                allergenes: "Test"
            };


            chai.request(server)
                .put(`/api/meal/999`)
                .set('Authorization', 'Bearer ' + token)
                .send(updatedData)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').to.equal(404);
                    res.body.should.have.property('success').to.equal(false);
                    done();
                });
        });
        it('TC-302-5 Maaltijd succesvol gewijzigd', (done) => {
            const updatedData = {
                isActive: 1,
                isVega: 0,
                isVegan: 0,
                isToTakeHome: 1,
                dateTime: "2023-05-18 17:00:00",
                maxAmountOfParticipants: 6,
                price: 13,
                imageUrl: "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                createDate: "2023-05-18T17:02:56.963Z",
                updateDate: "2023-05-26 12:33:51.000000",
                name: "PASTAAA",
                description: "Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!",
                allergenes: "gluten,lactose"
            };

            chai.request(server)
                .put(`/api/meal/${mealId}`)
                .set('Authorization', 'Bearer ' + token)
                .send(updatedData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').to.equal(200);
                    res.body.should.have.property('success').to.equal(true);
                    done();
                });
        });
    });

    // UC-303 Opvragen van alle maaltijden
    describe('UC-303 Opvragen van alle maaltijden', function () {
        it('TC-303-1 - Lijst van maaltijden geretourneerd', (done) => {
            chai
                .request(server)
                .get('/api/meal')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('success').to.equal(true);
                    res.body.should.have.property('message').to.be.a('string');
                    res.body.should.have.property('data').to.be.an('array');
                    console.log(res.body.data);
                    done();
                });
        });
    });

    // UC-304 Opvragen van maaltijd bij ID
    describe('UC-304 Opvragen van maaltijd bij ID', function () {
        it('TC-304-1 - Maaltijd bestaat niet', (done) => {
            chai
                .request(server)
                .get('/api/meal/10000')
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').to.equal(404);
                    res.body.should.have.property('success').to.equal(false);
                    res.body.should.have.property('message').to.be.a('string');
                    res.body.should.have.property('data').to.be.an('object');
                    done();
                });
        });

        it('TC-304-2 - Details van maaltijd geretourneerd', (done) => {
            chai
                .request(server)
                .get('/api/meal/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('success').to.equal(true);
                    res.body.should.have.property('message').to.be.a('string');
                    res.body.should.have.property('data').to.be.an('object');
                    console.log(res.body.data);
                    done();
                });
        });
    });
    // UC-305 Verwijderen van maaltijd
    describe('UC-305 Verwijderen van maaltijd', function () {
        it('TC-305-1 - Niet ingelogd', (done) => {
            chai
                .request(server)
                .delete('/api/meal/:id')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').to.equal(401);
                    res.body.should.have.property('success').to.equal(false);
                    res.body.should.have.property('message').to.be.a('string');
                    res.body.should.have.property('data').to.be.an('object');
                    done();
                });
        });

        // Add more test cases for UC-305
        it('TC-305-2 - Niet de eigenaar van de data', (done) => {
            chai
                .request(server)
                .delete('/api/meal/1')
                .set('Authorization', 'Bearer ' + token) // Use token of a different user
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').to.equal(403);
                    res.body.should.have.property('success').to.equal(false);
                    done();
                });
        });

        it('TC-305-3 - Maaltijd bestaat niet', (done) => {
            chai
                .request(server)
                .delete('/api/meal/999')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').to.equal(404);
                    res.body.should.have.property('success').to.equal(false);
                    done();
                });
        });

        it('TC-305-4 - Maaltijd succesvol verwijderd', (done) => {
            chai
                .request(server)
                .delete(`/api/meal/${mealId}`)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').to.equal(200);
                    res.body.should.have.property('success').to.equal(true);
                    done();
                });
        });
        // UC-305 Verwijderen van maaltijd
        describe('UC-401 Aanmelden voor maaltijd', function () {
            it('TC-401-3 - Succesvol aangemeld', (done) => {
                chai
                    .request(server)
                    .post('/api/meal/1/participate')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.equal(200);
                        res.body.should.have.property('success').to.equal(true);
                        console.log(res.body.message);
                        done();
                    });
            });
            it('TC-401-4 - Maximumaantal aanmeldingen is bereikt', (done) => {
                chai
                    .request(server)
                    .post('/api/meal/1/participate')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.equal(200);
                        res.body.should.have.property('success').to.equal(false);
                        done();
                    });
            });

        })
        describe('UC-402 Afmelden voor maaltijd', function () {
            it('TC-402-1 - Niet ingelogd', (done) => {
                chai
                    .request(server)
                    .delete('/api/meal/1/participate')
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.equal(401);
                        res.body.should.have.property('success').to.equal(false);
                        done();
                    });
            });
            it('TC-402-2 - Maaltijd bestaat niet', (done) => {
                chai
                    .request(server)
                    .delete('/api/meal/9999/participate')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(404);
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.equal(404);
                        res.body.should.have.property('success').to.equal(false);
                        done();
                    });
            });
            it('TC-402-3 - Aanmelding bestaat niet', (done) => {
                chai
                    .request(server)
                    .delete('/api/meal/2/participate')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(404);
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.equal(404);
                        res.body.should.have.property('success').to.equal(false);
                        done();
                    });
            });
            it('TC-402-4 - Succesvol afgemeld', (done) => {
                chai
                    .request(server)
                    .delete('/api/meal/1/participate')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.equal(200);
                        res.body.should.have.property('success').to.equal(true);
                        done();
                    });
            });

        })
    });
    // UC-305 Verwijderen van maaltijd
    describe('UC-401 Aanmelden voor maaltijd', function () {

        it('TC-401-1 - Niet ingelogd', (done) => {
            chai
                .request(server)
                .post('/api/meal/1/signup')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').to.equal(401);
                    res.body.should.have.property('success').to.equal(false);
                    done();
                });
        });
        it('TC-401-2 - Maaltijd bestaat niet', (done) => {
            chai
                .request(server)
                .post('/api/meal/999/participate')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').to.equal(404);
                    res.body.should.have.property('success').to.equal(false);
                    done();
                });
        });

    });






})


