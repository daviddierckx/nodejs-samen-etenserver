const app = require('./../../server.js');
const chai = require('chai');
const expect = require('chai').expect
const faker = require('faker/locale/nl');
chai.use(require('chai-http'));

const collectedData = {};

//If disabled it is possible to seed the database with some data
const alsoDelete = true;

describe('API', function () {
    describe('info', function () {
        it('should return server info without error', function (done) {
            chai.request(app)
                .get('/api/info')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done()
                });
        });
    });
    describe('#UC-201 Register', function () {
        it('#TC-201-1 missing param', function (done) {
            // Removed 'studentnumber' param
            const register_data = {
                'firstname': faker.name.firstName(undefined),
                'lastname': faker.name.lastName(false),
                'email_address': faker.internet.email(undefined),
                'password': faker.internet.password()
            };
            chai.request(app)
                .post('/api/register')
                .type('form')
                .send(register_data)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                    done()
                });
        });
        it('#TC-201-2 invalid email', function (done) {
            // Changed email_address to a firstname param
            const register_data = {
                'firstname': faker.name.firstName(undefined),
                'lastname': faker.name.lastName(false),
                'studentnumber': faker.datatype.number(),
                'email_address': faker.name.firstName(undefined),
                'password': faker.internet.password()
            };
            chai.request(app)
                .post('/api/register')
                .type('form')
                .send(register_data)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                    done()
                });
        });
        it('#TC-201-3 invalid password', function (done) {
            // Changed the password to a very short one
            const register_data = {
                'firstname': faker.name.firstName(undefined),
                'lastname': faker.name.lastName(false),
                'studentnumber': faker.datatype.number(),
                'email_address': faker.internet.email(undefined),
                'password': faker.internet.password().substring(1, 4)
            };
            chai.request(app)
                .post('/api/register')
                .type('form')
                .send(register_data)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                    done()
                });
        });
        it('#TC-201-5 should register a user without error', function (done) {
            const register_data = {
                "firstname": faker.name.firstName(undefined),
                "lastname": faker.name.lastName(false),
                "isActive": faker.datatype.number(),
                "emailAddress": faker.internet.email(),
                "password": faker.internet.password(),
                "phoneNumber": "0488367478",
                "roles": "guest",
                "street": "zwaluwlaan",
                "city": "brecht"
            };
            chai.request(app)
                .post('/api/register')
                .type('form')
                .send(register_data)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res).to.have.property('body').to.have.property('success').to.equal(true);
                    expect(res).to.have.property('body').to.have.property('token');
                    collectedData.authToken = res.body.token;
                    collectedData.userId = res.body.user_id;
                    collectedData.registerData = register_data;
                    done()
                });
        });

        // Make shure the users is registered first before executing this test
        it('#TC-201-4 Register a duplicate email address', function (done) {
            // The email_address of the previous registered user is used
            const register_data = {
                'firstname': faker.name.firstName(undefined),
                'lastname': faker.name.lastName(false),
                'studentnumber': faker.datatype.number(),
                'email_address': collectedData.registerData.email_address,
                'password': faker.internet.password()
            };
            chai.request(app)
                .post('/api/register')
                .type('form')
                .send(register_data)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                    done()
                });
        });
    });
    describe('#UC-101 Login', function () {
        it('#TC-101-1 Missing param', function (done) {
            //Removed email param
            chai.request(app)
                .post('/api/login')
                .type('form')
                .send({
                    'password': collectedData.registerData.password
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                    done()
                });
        });
        it('#TC-101-2 Invalid emaill', function (done) {
            // Entered password twice
            chai.request(app)
                .post('/api/login')
                .type('form')
                .send({
                    'email_address': collectedData.registerData.password,
                    'password': collectedData.registerData.password
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                    done()
                });
        });
        it('#TC-101-3 Invalid password', function (done) {
            // Entered a to short password
            chai.request(app)
                .post('/api/login')
                .type('form')
                .send({
                    'email_address': collectedData.registerData.email_address,
                    'password': collectedData.registerData.password.substring(0, 5)
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                    done()
                });
        });
        it('#TC-101-4 User does not exist', function (done) {
            // Removed first character of email to simulate a typo
            chai.request(app)
                .post('/api/login')
                .type('form')
                .send({
                    'email_address': collectedData.registerData.emailAddress.substring(1),
                    'password': collectedData.registerData.password
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                    done()
                });
        });
        it('#TC-101-5 should login a user', function (done) {
            chai.request(app)
                .post('/api/login')
                .type('form')
                .send({
                    'email_address': collectedData.registerData.emailAddress,
                    'password': collectedData.registerData.password
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res).to.have.property('body').to.have.property('success').to.equal(true);
                    expect(res).to.have.property('body').to.have.property('token');
                    collectedData.authToken = res.body.token;
                    done()
                });
        });
    });
    describe('Studenthouse Meals', function () {
        // Create a student house for testing since the last one was deleted
        const date = faker.date.past(undefined, undefined);
        date.setMilliseconds(0);
        it('#TC-300-0 should create a meal used for meal testing', function (done) {
            const meal_data = {
                "isActive": 1,
                "isVega": 2,
                "isVegan": 1,
                "isToTakeHome": 1,
                "dateTime": date.toISOString(),
                "maxAmountOfParticipants": 6,
                "price": 10,
                "imageUrl": "www.cutefacepat.com",
                "cookId": 1,
                "createDate": date.toISOString(),
                "updateDate": date.toISOString(),
                "name": "Worst met spekjes",
                "description": "Heerlijke worst, dé winterkost bij uitstek. ",
                "allergenes": "gluten"
            };
            chai.request(app)
                .post('/api/meal')
                .type('form')
                .set({ "Authorization": `Bearer ${collectedData.authToken}` })
                .send(meal_data)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res).to.have.property('body').to.have.property('success').to.equal(true);
                    expect(res).to.have.property('body').to.have.property('meal').own.include(meal_data);
                    collectedData.createdMeal = res.body.meal;
                    done()
                });
        });
        describe('#UC-301 Creation of a meal', function () {
            it('#TC-301-1 missing param', function (done) {
                // Removed name param
                const date = faker.date.past(undefined, undefined);
                date.setMilliseconds(0);
                const meal_data = {
                    // 'description': faker.commerce.productDescription(),
                    // 'price': faker.datatype.number(),
                    // 'allergies': JSON.stringify([faker.commerce.productMaterial(), faker.commerce.productMaterial()]),
                    // 'ingredients': JSON.stringify([faker.animal.cow(), faker.animal.horse(), faker.animal.fish(), faker.animal.rabbit()]),
                    // 'offered_since': date.toISOString()

                    "isActive": 1,
                    "isVega": 2,
                    "isVegan": 1,
                    "isToTakeHome": 1,
                    "dateTime": date.toISOString(),
                    "price": faker.datatype.number(),
                    "imageUrl": "www.cutefacepat.com",
                    "cookId": 1,
                    "createDate": date.toISOString(),
                    "updateDate": date.toISOString(),
                    "name": "Worst met spekjes",
                    "description": faker.commerce.productDescription(),
                    "allergenes": "gluten"
                };
                chai.request(app)
                    .post(`/api/meal/`)
                    .set({ "Authorization": `Bearer ${collectedData.authToken}` })
                    .type('form')
                    .send(meal_data)
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                        done()
                    });
            });
            it('#TC-301-2 missing authorization', function (done) {
                // Removed authorization header
                const date = faker.date.past(undefined, undefined);
                date.setMilliseconds(0);
                const meal_data = {
                    "isActive": 1,
                    "isVega": 2,
                    "isVegan": 1,
                    "isToTakeHome": 1,
                    "dateTime": date.toISOString(),
                    "maxAmountOfParticipants": 6,
                    "price": faker.datatype.number(),
                    "imageUrl": "www.cutefacepat.com",
                    "cookId": 1,
                    "createDate": date.toISOString(),
                    "updateDate": date.toISOString(),
                    "name": "Worst met spekjes",
                    "description": faker.commerce.productDescription(),
                    "allergenes": "gluten"
                };
                chai.request(app)
                    .post(`/api/meal/`)
                    .type('form')
                    .send(meal_data)
                    .end((err, res) => {
                        expect(res).to.have.status(401);
                        expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                        done()
                    });
            });
            it('#TC-301-3 Should create a meal', function (done) {
                const date = faker.date.past(undefined, undefined);
                date.setMilliseconds(0);
                const meal_data = {
                    "isActive": 1,
                    "isVega": 2,
                    "isVegan": 1,
                    "isToTakeHome": 1,
                    "dateTime": date.toISOString(),
                    "maxAmountOfParticipants": 6,
                    "price": faker.datatype.number(),
                    "imageUrl": "www.cutefacepat.com",
                    "cookId": 1,
                    "createDate": date.toISOString(),
                    "updateDate": date.toISOString(),
                    "name": "Worst met spekjes",
                    "description": faker.commerce.productDescription(),
                    "allergenes": "gluten"
                };
                chai.request(app)
                    .post(`/api/meal/`)
                    .set({ "Authorization": `Bearer ${collectedData.authToken}` })
                    .type('form')
                    .send(meal_data)
                    .end((err, res) => {
                        expect(res).to.have.status(201);
                        expect(res).to.have.property('body').to.have.property('success').to.equal(true);
                        done()
                    });
            });
        });
        describe('#UC-302 update of a meal', function () {
            it('#TC-302-1 missing param', function (done) {
                // Removed description param
                const date = faker.date.past(undefined, undefined);
                date.setMilliseconds(0);
                const meal_data = {
                    "isActive": 1,
                    "isVega": 2,
                    "isVegan": 1,
                    "isToTakeHome": 1,
                    "dateTime": date.toISOString(),
                    "price": faker.datatype.number(),
                    "imageUrl": "www.cutefacepat.com",
                    "cookId": 1,
                    "createDate": date.toISOString(),

                };
                chai.request(app)
                    .put(`/api/meal/${collectedData.createdMeal.id}`)
                    .set({ "Authorization": `Bearer ${collectedData.authToken}` })
                    .type('form')
                    .send(meal_data)
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                        done()
                    });
            });

            it('#TC-302-2 Not signed in', function (done) {
                // Removed authorization header
                const date = faker.date.past(undefined, undefined);
                date.setMilliseconds(0);
                const meal_data = {
                    "isActive": 1,
                    "isVega": 2,
                    "isVegan": 1,
                    "isToTakeHome": 1,
                    "dateTime": date.toISOString(),
                    "maxAmountOfParticipants": 6,
                    "price": faker.datatype.number(),
                    "imageUrl": "www.cutefacepat.com",
                    "cookId": 1,
                    "createDate": date.toISOString(),
                    "updateDate": date.toISOString(),
                    "name": "Worst met spekjes",
                    "description": faker.commerce.productDescription(),
                    "allergenes": "gluten"
                };
                chai.request(app)
                    .put(`/api/meal/${collectedData.createdMeal.id}`)
                    .type('form')
                    .send(meal_data)
                    .end((err, res) => {
                        expect(res).to.have.status(401);
                        expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                        done()
                    });
            });

            it('#TC-302-3 not the owner of the meal', function (done) {
                // Changed authorization header
                const date = faker.date.past(undefined, undefined);
                date.setMilliseconds(0);
                const meal_data = {
                    "isActive": 1,
                    "isVega": 2,
                    "isVegan": 1,
                    "isToTakeHome": 1,
                    "dateTime": date.toISOString(),
                    "maxAmountOfParticipants": 6,
                    "price": faker.datatype.number(),
                    "imageUrl": "www.cutefacepat.com",
                    "cookId": 1,
                    "createDate": date.toISOString(),
                    "updateDate": date.toISOString(),
                    "name": "Worst met spekjes",
                    "description": faker.commerce.productDescription(),
                    "allergenes": "gluten"
                };
                chai.request(app)
                    .put(`/api/meal/${collectedData.createdMeal.id}`)
                    .set({ "Authorization": `Bearer ${collectedData.authToken2}` })
                    .type('form')
                    .send(meal_data)
                    .end((err, res) => {
                        expect(res).to.have.status(401);
                        expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                        done()
                    });
            });

            it('#TC-302-4 Meal does not exist', function (done) {
                // Randopm mealId
                const date = faker.date.past(undefined, undefined);
                date.setMilliseconds(0);
                const meal_data = {
                    "isActive": 1,
                    "isVega": 2,
                    "isVegan": 1,
                    "isToTakeHome": 1,
                    "dateTime": date.toISOString(),
                    "maxAmountOfParticipants": 6,
                    "price": faker.datatype.number(),
                    "imageUrl": "www.cutefacepat.com",
                    "cookId": 1,
                    "createDate": date.toISOString(),
                    "updateDate": date.toISOString(),
                    "name": "Worst met spekjes",
                    "description": faker.commerce.productDescription(),
                    "allergenes": "gluten"
                };
                chai.request(app)
                    .put(`/api/meal/${faker.datatype.number()}`)
                    .set({ "Authorization": `Bearer ${collectedData.authToken}` })
                    .type('form')
                    .send(meal_data)
                    .end((err, res) => {
                        expect(res).to.have.status(404);
                        expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                        done()
                    });
            });

            it('#TC-302-5 Should update a meal', function (done) {
                const date = faker.date.past(undefined, undefined);
                date.setMilliseconds(0);
                const meal_data = {
                    "isActive": 1,
                    "isVega": 2,
                    "isVegan": 1,
                    "isToTakeHome": 1,
                    "dateTime": date.toISOString(),
                    "maxAmountOfParticipants": 6,
                    "price": faker.datatype.number(),
                    "imageUrl": "www.cutefacepat.com",
                    "cookId": 1,
                    "createDate": date.toISOString(),
                    "updateDate": date.toISOString(),
                    "name": "Worst met spekjes",
                    "description": faker.commerce.productDescription(),
                    "allergenes": "gluten"
                };
                chai.request(app)
                    .put(`/api/meal/${collectedData.createdMeal.id}`)
                    .set({ "Authorization": `Bearer ${collectedData.authToken}` })
                    .type('form')
                    .send(meal_data)
                    .end((err, res) => {
                        expect(res).to.have.status(202);
                        expect(res).to.have.property('body').to.have.property('success').to.equal(true);
                        collectedData.createdMeal = res.body.meal;
                        done()
                    });
            });
        });

        describe('#UC-303 List meals', function () {
            it('#TC-303-1 should list all meals', function (done) {
                chai.request(app)
                    .get('/api/meal/')
                    .set({ "Authorization": `Bearer ${collectedData.authToken}` })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.have.property('body').to.have.property('success').to.equal(true);
                        collectedData.listMeals = res.body.meal;
                        done()
                    });
            });
        });
        describe('#UC-304 Details of a meal', function () {
            it('#TC-304-1 non existing mealId', function (done) {
                // Changed mealId to a non-existing one
                chai.request(app)
                    .get(`/api/meal/${faker.datatype.number()}`)
                    .set({ "Authorization": `Bearer ${collectedData.authToken}` })
                    .end((err, res) => {
                        expect(res).to.have.status(404);
                        expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                        done()
                    });
            });

            it('#TC-304-2 should list details of a meal', function (done) {
                chai.request(app)
                    .get(`/api/meal/${collectedData.createdMeal.id}`)
                    .set({ "Authorization": `Bearer ${collectedData.authToken}` })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.have.property('body').to.have.property('success').to.equal(true);
                        collectedData.mealDetails = res.body.meal;
                        done()
                    });
            });
        });
        describe('#UC-305 Delete a meal', function () {
            if (alsoDelete) {
                it('#TC-305-1 Non existing meal', function (done) {
                    // Changed mealId to a non-existing one
                    chai.request(app)
                        .del(`/api/meal/${faker.datatype.number()}`)
                        .set({ "Authorization": `Bearer ${collectedData.authToken}` })
                        .end((err, res) => {
                            expect(res).to.have.status(404);
                            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                            done()
                        });
                });
                it('#TC-305-2 Auhtorization missing', function (done) {
                    // Removed authorization header
                    chai.request(app)
                        .del(`/api/meal/${collectedData.createdMeal.id}`)
                        .end((err, res) => {
                            expect(res).to.have.status(401);
                            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                            done()
                        });
                });
                it('#TC-305-3 Actor is not the owner', function (done) {
                    // Changed authorization header
                    chai.request(app)
                        .del(`/api/meal/${collectedData.createdMeal.id}`)
                        .set({ "Authorization": `Bearer ${collectedData.authToken2}` })
                        .end((err, res) => {
                            expect(res).to.have.status(401);
                            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                            done()
                        });
                });
                it('#TC-305-1 should delete a meal', function (done) {
                    chai.request(app)
                        .del(`/api/meal/${collectedData.createdMeal.id}`)
                        .set({ "Authorization": `Bearer ${collectedData.authToken}` })
                        .end((err, res) => {
                            expect(res).to.have.status(202);
                            expect(res).to.have.property('body').to.have.property('success').to.equal(true);
                            expect(res).to.have.property('body').to.have.property('id').to.equal(collectedData.createdMeal.id);
                            collectedData.deleteHouse = res.body.id;
                            done()
                        });
                });
            }
        });
        describe('#UC-401 Aanmelden voor maaltijd', function () {

            it('#TC-401-1 Not signed in', function (done) {
                // Removed authorization header
                const date = faker.date.past(undefined, undefined);
                date.setMilliseconds(0);
                chai.request(app)
                    .put(`/api/meal/1/participate`)
                    .type('form')
                    .send()
                    .end((err, res) => {
                        expect(res).to.have.status(401);
                        expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                        done()
                    });
            });

            it('#TC-401-2 Meal does not exist', function (done) {
                chai.request(app)
                    .post(`/api/meal/${faker.datatype.number()}/participate`)
                    .set({ "Authorization": `Bearer ${collectedData.authToken}` })
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                        done()
                    });
            });
            it('#TC-401-3 Succesvol aangemeld', function (done) {
                chai.request(app)
                    .post(`/api/meal/1/participate`)
                    .set({ "Authorization": `Bearer ${collectedData.authToken}` })
                    .end((err, res) => {
                        expect(res).to.have.status(201);
                        expect(res).to.have.property('body').to.have.property('success').to.equal(true);
                        done()
                    });
            });
        });

        describe('#UC-402 Afmelden voor maaltijd', function () {

            it('#TC-402-1 Not signed in', function (done) {
                // Removed authorization header
                const date = faker.date.past(undefined, undefined);
                date.setMilliseconds(0);
                chai.request(app)
                    .delete(`/api/meal/1/participate`)
                    .type('form')
                    .send()
                    .end((err, res) => {
                        expect(res).to.have.status(401);
                        expect(res).to.have.property('body').to.have.property('success').to.equal(false);
                        done()
                    });
            });

            it('#TC-402-2 Meal does not exist', function (done) {
                chai.request(app)
                    .delete(`/api/meal/${faker.datatype.number()}/participate`)
                    .set({ "Authorization": `Bearer ${collectedData.authToken}` })
                    .end((err, res) => {
                        expect(res).to.have.status(404);
                        done()
                    });
            });
            it('#TC-401-3 Succesvol afgemeld', function (done) {
                chai.request(app)
                    .delete(`/api/meal/1/signoff`)
                    .set({ "Authorization": `Bearer ${collectedData.authToken}` })
                    .end((err, res) => {
                        expect(res).to.have.status(201);
                        expect(res).to.have.property('body').to.have.property('success').to.equal(true);
                        done()
                    });
            });
        });
    });
})
