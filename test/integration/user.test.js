process.env['DB_DATABASE'] = process.env.DB_DATABASE || 'shareameal-testdb';

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const dbconnection = require('../../app/dao/database');
const mysql = require('mysql');
const config = require('../../app/config');

const jwt = require('jsonwebtoken');
require('tracer').setLevel('error');

chai.should();
chai.use(chaiHttp);


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

/**
 * Db queries to clear and fill the test database before each test.
 *
 * LET OP: om via de mysql2 package meerdere queries in één keer uit te kunnen voeren,
 * moet je de optie 'multipleStatements: true' in de database config hebben staan.
 */
const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM `meal`;';
const CLEAR_PARTICIPANTS_TABLE = 'DELETE IGNORE FROM `meal_participants_user`;';
const CLEAR_USERS_TABLE = 'DELETE IGNORE FROM `user`;';
const CLEAR_DB =
    CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLE;

/**
 * Voeg een user toe aan de database. Deze user heeft id 1.
 * Deze id kun je als foreign key gebruiken in de andere queries, bv insert meal.
 */
const INSERT_USER =
    'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city`,`isActive` ) VALUES' +
    '(1, "first", "last", "test@hotmail.com", "secret", "street", "city",0);';


/**
 * Query om twee meals toe te voegen. Let op de cookId, die moet matchen
 * met een bestaande user in de database.
 */
const INSERT_MEALS =
    'INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `dateTime`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' +
    "(1, 'Meal A', 'description', 'image url', NOW(), 5, 6.50, 1)," +
    "(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 1);";





let token;
let loginToken;

let gebruikerId;






describe('USER API', function () {

    //TODO
    this.beforeAll((done) => {
        testConnection.connect((err) => {
            if (err) {
                throw err;
            }
            testConnection.query(CLEAR_MEAL_TABLE, (error, results, fields) => {
                if (error) {
                    done(error);
                    throw error;
                }
            });
            testConnection.query(CLEAR_PARTICIPANTS_TABLE, (error, results, fields) => {
                if (error) {
                    done(error);
                    throw error;
                }
            });
            testConnection.query(CLEAR_USERS_TABLE, (error, results, fields) => {
                if (error) {
                    done(error);
                    throw error;
                }
            });
            testConnection.query(INSERT_USER, (error, results, fields) => {
                if (error) {
                    done(error);
                    throw error;
                }
            });
            testConnection.query(INSERT_MEALS, (error, results, fields) => {
                if (error) {
                    done(error);
                    throw error;
                }
            });
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
                    chai
                        .request(server)
                        .post('/api/login')
                        .send({ email_address: 'user@hotmail.com', password: 'User@1234' })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.an('object');
                            res.body.should.have.property('message').to.be.equal('Gebruiker succesvol ingelogd');

                            //TODO
                            // res.body.data.user.should.have.property('user_id');
                            // res.body.data.should.have.property('token');
                            global.loginToken = res.body.token
                            loginToken = res.body.token

                            console.log("Res login User" + global.loginToken);
                            done();
                        });
                });

        });
    });


    describe('UC-101 Inloggen', function () {
        describe('TC-101-1 Verplicht veld ontbreekt', function () {
            it('should return status code 400 and specific error message', function (done) {
                chai
                    .request(server)
                    .post('/api/login')
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').to.be.equal('Verplicht veld ontbreekt');
                        res.body.should.have.property('data');
                        done();
                    });
            });
        });

        describe('TC-101-2 Niet-valide wachtwoord', function () {
            it('should return status code 400 and specific error message', function (done) {
                chai
                    .request(server)
                    .post('/api/login')
                    .send({ email_address: "test@hotmail.com", password: 'invalidpassword' })
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').to.be.equal('Niet-valide wachtwoord');
                        res.body.should.have.property('data');
                        done();
                    });
            });
        });

        describe('TC-101-3 Gebruiker bestaat niet', function () {
            it('should return status code 404 and specific error message', function (done) {
                chai
                    .request(server)
                    .post('/api/login')
                    .send({ email_address: 'nonexistent@example.com', password: 'User@1234' })
                    .end((err, res) => {
                        res.should.have.status(404);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').to.be.equal('Gebruiker bestaat niet');
                        res.body.should.have.property('data');
                        done();
                    });
            });
        });
        describe('TC-101-4 Gebruiker succesvol ingelogd', function () {
            it('should return status code 200, success message, and user information with token', function (done) {



                chai
                    .request(server)
                    .post('/api/login')
                    .send({ email_address: 'user@hotmail.com', password: 'User@1234' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').to.be.equal('Gebruiker succesvol ingelogd');

                        //TODO
                        // res.body.data.user.should.have.property('user_id');
                        // res.body.data.should.have.property('token');
                        done();
                    });

            });
        });

    });


    //////////////////////////////UC-201


    describe('UC-201 Registreren', function () {
        it('TC-201-1 - Als nieuwe gebruiker ontbreekt een verplicht veld', (done) => {
            chai
                .request(server)
                .post('/api/user')
                .send({
                    firstname: "David",
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
                    res.body.should.have.property('status').to.be.equal(400);
                    res.body.should.have.property('success').to.be.false;
                    res.body.should.have.property('message').to.be.equal('Verplicht veld ontbreekt');
                    res.body.should.have.property('data').to.deep.equal({});
                    done();
                });
        });

        it('TC-201-2 - Niet-valide emailadres', (done) => {
            chai
                .request(server)
                .post('/api/user')
                .send({
                    firstname: "David",
                    lastname: "Dierckx",
                    isActive: 1,
                    emailAddress: "Invalidhotmail",
                    password: "User@1234",
                    phoneNumber: "0498367874",
                    roles: "editor,guest",
                    street: "zwaluw",
                    city: "req"
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').to.be.equal(400);
                    res.body.should.have.property('success').to.be.false;
                    res.body.should.have.property('message').to.be.equal('Niet-valide emailadres');
                    res.body.should.have.property('data').to.deep.equal({});
                    done();
                });
        });

        it('TC-201-3 - Niet-valide wachtwoord', (done) => {
            chai
                .request(server)
                .post('/api/user')
                .send({
                    firstname: "David",
                    lastname: "Dierckx",
                    isActive: 1,
                    emailAddress: "user544@hotmail.com",
                    password: "1234",
                    phoneNumber: "0498367874",
                    roles: "editor,guest",
                    street: "zwaluw",
                    city: "req"
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').to.be.equal(400);
                    res.body.should.have.property('success').to.be.false;
                    res.body.should.have.property('message').to.be.equal('Niet-valide wachtwoord');
                    res.body.should.have.property('data').to.deep.equal({});
                    done();
                });
        });

        it('TC-201-4 - Gebruiker bestaat al', (done) => {
            chai
                .request(server)
                .post('/api/user')
                .send({
                    firstname: "David",
                    lastname: "Dierckx",
                    isActive: 1,
                    emailAddress: "test@hotmail.com",
                    password: "User@1234",
                    phoneNumber: "0498367874",
                    roles: "editor,guest",
                    street: "zwaluw",
                    city: "req"
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').to.be.equal(403);
                    res.body.should.have.property('success').to.be.false;
                    res.body.should.have.property('message').to.be.equal('Gebruiker bestaat al');
                    res.body.should.have.property('data').to.deep.equal({});
                    done();
                });
        });

        it('TC-201-5 - Gebruiker succesvol geregistreerd', (done) => {


            chai
                .request(server)
                .post('/api/user')
                .send({
                    firstname: "David",
                    lastname: "Dierckx",
                    isActive: 1,
                    emailAddress: "userTest@hotmail.com",
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
                    done();
                });
        })






        /////////UC202
        describe('UC-202 Opvragen van overzicht van users', function () {

            it('TC-202-1 - Toon alle gebruikers (minimaal 2)', (done) => {
                chai
                    .request(server)
                    .get('/api/user')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        console.log("RES BODY: ", res.body);

                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(200);
                        res.body.should.have.property('message').to.be.equal('Users successfully returned');

                        res.body.data.should.have.lengthOf.at.least(2);
                        done();
                    });
            });

            it('TC-202-2 - Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {
                chai
                    .request(server)
                    .get('/api/user?city=LoremIpsum&isActive=12')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(200);
                        res.body.should.have.property('message');
                        res.body.should.have.property('data').to.be.an('array').to.have.lengthOf(0);
                        done();
                    });
            });

            it('TC-202-3 - Toon gebruikers met gebruik van de zoekterm op het veld \'isActive\'=false', (done) => {
                chai
                    .request(server)
                    .get('/api/user?city=&isActive=0')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(200);
                        res.body.should.have.property('message');
                        res.body.should.have.property('data').to.be.an('array').to.have.lengthOf.at.least(1);
                        done();
                    });
            });

            it('TC-202-4 - Toon gebruikers met gebruik van de zoekterm op het veld \'isActive\'=true', (done) => {
                chai
                    .request(server)
                    .get('/api/user?city=&isActive=1')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(200);
                        res.body.should.have.property('message');
                        res.body.should.have.property('data').to.be.an('array').to.have.lengthOf.at.least(1);
                        done();
                    });
            });

            it('TC-202-5 - Toon gebruikers met zoektermen op bestaande velden (max op 2 velden filteren)', (done) => {
                chai
                    .request(server)
                    .get('/api/user?name=Dierckx&isActive=1')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(200);
                        res.body.should.have.property('message');
                        res.body.should.have.property('data').to.be.an('array').to.have.lengthOf.at.least(1);
                        done();
                    });
            });
        });





        /////////UC-203
        describe('UC-203 Opvragen van gebruikersprofiel', function () {
            it('TC-203-1 - Ongeldig token', (done) => {
                chai
                    .request(server)
                    .get('/api/profile')
                    .set('Authorization', 'Bearer invalid_token')
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(401);
                        res.body.should.have.property('message').to.be.equal('Ongeldig token');
                        done();
                    });
            });

            it('TC-203-2 - Gebruiker is ingelogd met geldig token', (done) => {
                chai
                    .request(server)
                    .get('/api/user/profile')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(200);
                        res.body.should.have.property('message');
                        res.body.should.have.property('data')
                        done();
                    });
            });
        });




        ///UC-204


        describe('UC-204 Opvragen van usergegevens bij ID', function () {
            it('TC-204-1 - Ongeldig token', (done) => {
                chai
                    .request(server)
                    .get('/api/user/123')
                    .set('Authorization', 'Bearer invalid_token')
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(401);
                        res.body.should.have.property('message').to.be.equal('Ongeldig token');
                        done();
                    });
            });

            it('TC-204-2 - Gebruiker-ID bestaat niet', (done) => {
                chai
                    .request(server)
                    .get('/api/user/999')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').to.be.equal('Gebruiker-ID bestaat niet');
                        res.body.should.have.property('data').to.deep.equal({});
                        done();
                    });
            });

            it('TC-204-3 - Gebruiker-ID bestaat', (done) => {
                chai
                    .request(server)
                    .get('/api/user/1')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(200);
                        res.body.should.have.property('message');
                        res.body.should.have.property('data')
                        done();
                    });
            });
        });




        //UC-205

        describe('UC-205 Updaten van usergegevens', function () {
            it('TC-205-1 - Verplicht veld "emailAddress" ontbreekt', (done) => {
                chai
                    .request(server)
                    .put('/api/user/1')
                    .set('Authorization', 'Bearer ' + token)
                    .send({})
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(400);
                        res.body.should.have.property('message').to.be.equal(`Verplicht veld "emailAddress" ontbreekt`);
                        res.body.should.have.property('data').to.deep.equal({});
                        done();
                    });
            });

            it('TC-205-2 - De gebruiker is niet de eigenaar van de data', (done) => {
                chai
                    .request(server)
                    .put('/api/user/1')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        firstname: "David",
                        lastname: "Dierckx",
                        isActive: 1,
                        emailAddress: "userTest43@hotmail.com",
                        password: "User@1234",
                        phoneNumber: "0498367874",
                        roles: "editor,guest",
                        street: "zwaluw",
                        city: "req"
                    })
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(403);
                        res.body.should.have.property('message').to.be.equal('De gebruiker is niet de eigenaar van de data');
                        res.body.should.have.property('data').to.deep.equal({});
                        done();
                    });
            });

            it('TC-205-3 - Niet-valide telefoonnummer', (done) => {
                chai
                    .request(server)
                    .put('/api/user/1')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        firstname: "David",
                        lastname: "Dierckx",
                        isActive: 1,
                        emailAddress: "userTest43@hotmail.com",
                        password: "User@1234",
                        phoneNumber: "12345",
                        roles: "editor,guest",
                        street: "zwaluw",
                        city: "req"
                    })
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(400);
                        res.body.should.have.property('message').to.be.equal('Niet-valide telefoonnummer');
                        res.body.should.have.property('data').to.deep.equal({});
                        done();
                    });
            });

            it('TC-205-4 - Gebruiker bestaat niet', (done) => {
                chai
                    .request(server)
                    .put(`/api/user/${gebruikerId}`)
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        firstname: "David",
                        lastname: "Dierckx",
                        isActive: 1,
                        emailAddress: "BestaatNiet@hotmail.com",
                        password: "User@1234",
                        phoneNumber: "0489464738",
                        roles: "editor,guest",
                        street: "zwaluw",
                        city: "req"
                    })
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(404);
                        res.body.should.have.property('message').to.be.equal('Gebruiker bestaat niet');
                        res.body.should.have.property('data').to.deep.equal({});
                        done();
                    });
            });

            it('TC-205-5 - Niet ingelogd', (done) => {
                chai
                    .request(server)
                    .put('/api/user/1')
                    .send({ emailAddress: 'new_email@example.com' })
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(401);
                        res.body.should.have.property('message').to.be.equal('Ongeldig token');
                        res.body.should.have.property('data').to.deep.equal({});
                        done();
                    });
            });

            it('TC-205-6 - Gebruiker succesvol gewijzigd', (done) => {
                chai
                    .request(server)
                    .put(`/api/user/${gebruikerId}`)
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        firstname: "Patrick",
                        lastname: "Dierckx",
                        isActive: 1,
                        emailAddress: "user@hotmail.com",
                        password: "User@1234",
                        phoneNumber: "0489464738",
                        roles: "editor,guest",
                        street: "zwaluw",
                        city: "req"
                    })
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(200);
                        res.body.should.have.property('message').to.be.equal('Gebruiker succesvol gewijzigd');
                        res.body.should.have.property('data')
                        done();
                    });
            });
        });




        ///UC-206



        describe('UC-206 Verwijderen van user', function () {
            it('TC-206-1 - Gebruiker bestaat niet', (done) => {
                chai
                    .request(server)
                    .delete('/api/user/999')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(404);
                        res.body.should.have.property('message').to.be.equal('Gebruiker bestaat niet');
                        res.body.should.have.property('data').to.deep.equal({});
                        done();
                    });
            });

            it('TC-206-2 - Gebruiker is niet ingelogd', (done) => {
                chai
                    .request(server)
                    .delete('/api/user/123')
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(401);
                        res.body.should.have.property('message').to.be.equal('Ongeldig token');
                        res.body.should.have.property('data').to.deep.equal({});
                        done();
                    });
            });

            it('TC-206-3 - De gebruiker is niet de eigenaar van de data', (done) => {
                chai
                    .request(server)
                    .delete('/api/user/1')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(403);
                        res.body.should.have.property('message').to.be.equal('De gebruiker is niet de eigenaar van de data');
                        res.body.should.have.property('data').to.deep.equal({});
                        done();
                    });
            });

            it('TC-206-4 - Gebruiker succesvol verwijderd', (done) => {
                chai
                    .request(server)
                    .delete(`/api/user/${gebruikerId}`)
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.have.property('status').to.be.equal(200);
                        res.body.should.have.property('message')

                        done();
                    });
            });
        });

        describe('Meal API', function () {


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
            });














            after((done) => {
                testConnection.end((err) => {
                    if (err) {
                        done(err);
                        throw err;
                    }
                    done();
                });
            });
            after((done) => {
                dbconnection.con.end((err) => {
                    if (err) {
                        done(err);
                        throw err;
                    }
                    done();
                });
            });

        });
    })

})