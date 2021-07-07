const app = require('../server');
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
  describe('#UC-101 Register', function () {
    it('#TC-101-1 missing param', function (done) {
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
    it('#TC-101-2 invalid email', function (done) {
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
    it('#TC-101-3 invalid password', function (done) {
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
    it('#TC-101-5 should register a user without error', function (done) {
      const register_data = {
        'firstname': faker.name.firstName(undefined),
        'lastname': faker.name.lastName(false),
        'studentnumber': faker.datatype.number(),
        'email_address': faker.internet.email(undefined),
        'password': faker.internet.password()
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
    it('#TC-101-4 Register a duplicate email address', function (done) {
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
  describe('#UC-102 Login', function () {
    it('#TC-102-1 Missing param', function (done) {
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
    it('#TC-102-2 Invalid emaill', function (done) {
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
    it('#TC-102-3 Invalid password', function (done) {
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
    it('#TC-102-4 User does not exist', function (done) {
      // Removed first character of email to simulate a typo
      chai.request(app)
        .post('/api/login')
        .type('form')
        .send({
          'email_address': collectedData.registerData.email_address.substring(1),
          'password': collectedData.registerData.password
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res).to.have.property('body').to.have.property('success').to.equal(false);
          done()
        });
    });
    it('#TC-102-5 should login a user', function (done) {
      chai.request(app)
        .post('/api/login')
        .type('form')
        .send({
          'email_address': collectedData.registerData.email_address,
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
  describe('Studenthouse', function () {
    describe('#UC-201 Create studenthouse', function () {
      it('#TC-201-1 missing param', function (done) {
        // removed street param
        const house_data = {
          'name': faker.company.companyName(undefined),
          'housenumber': faker.datatype.number(),
          'postalcode': faker.address.zipCode(undefined),
          'city': faker.address.city(),
          'phonenumber': "+316 22467104"
        };
        chai.request(app)
          .post('/api/studenthome')
          .type('form')
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .send(house_data)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
            done()
          });
      });
      it('#TC-201-2 Invalid postalcode', function (done) {
        // removed first char of postal code
        const house_data = {
          'name': faker.company.companyName(undefined),
          'street': faker.address.streetName(false),
          'housenumber': faker.datatype.number(),
          'postalcode': faker.address.zipCode(undefined).substring(1),
          'city': faker.address.city(),
          'phonenumber': "+316 22467104"
        };
        chai.request(app)
          .post('/api/studenthome')
          .type('form')
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .send(house_data)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
            done()
          });
      });
      it('#TC-201-3 Invalid phonenumber', function (done) {
        // Removed the +316- part of the phonenumber
        const house_data = {
          'name': faker.company.companyName(undefined),
          'street': faker.address.streetName(false),
          'housenumber': faker.datatype.number(),
          'postalcode': faker.address.zipCode(undefined),
          'city': faker.address.city(),
          'phonenumber': "22467104"
        };
        chai.request(app)
          .post('/api/studenthome')
          .type('form')
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .send(house_data)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
            done()
          });
      });
      it('#TC-201-5 Not signed in', function (done) {
        // Removed authorization part
        const house_data = {
          'name': faker.company.companyName(undefined),
          'street': faker.address.streetName(false),
          'housenumber': faker.datatype.number(),
          'postalcode': faker.address.zipCode(undefined),
          'city': faker.address.city(),
          'phonenumber': "+316 22467104"
        };
        chai.request(app)
          .post('/api/studenthome')
          .type('form')
          .send(house_data)
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
            done()
          });
      });

      it('#TC-201-6 should create a studenthouse', function (done) {
        const house_data = {
          'name': faker.company.companyName(undefined),
          'street': faker.address.streetName(false),
          'housenumber': faker.datatype.number(),
          'postalcode': faker.address.zipCode(undefined),
          'city': faker.address.city(),
          'phonenumber': "+316 22467104"
        };
        chai.request(app)
          .post('/api/studenthome')
          .type('form')
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .send(house_data)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res).to.have.property('body').to.have.property('success').to.equal(true);
            expect(res).to.have.property('body').to.have.property('house').own.include(house_data);
            expect(res).to.have.property('body').to.have.property('house').to.have.property('user_email').to.equal(collectedData.registerData.email_address)
            expect(res).to.have.property('body').to.have.property('house').to.have.property('user_fullname').to.equal(`${collectedData.registerData.firstname} ${collectedData.registerData.lastname}`);
            collectedData.createdHouse = res.body.house;
            done()
          });
      });

      // This should be after the creation of the original house to have a postalcode & housenumber
      it('#TC-201-4 House at address already exists', function (done) {
        // Replace housenumber&postalcode with previously created home data
        const house_data = {
          'name': faker.company.companyName(undefined),
          'street': faker.address.streetName(false),
          'housenumber': collectedData.createdHouse.housenumber,
          'postalcode': collectedData.createdHouse.postalcode,
          'city': faker.address.city(),
          'phonenumber': "+316 22467104"
        };
        chai.request(app)
          .post('/api/studenthome')
          .type('form')
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .send(house_data)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
            done()
          });
      });
    });
    describe('#UC-202 List studenthouses', function () {
      // There is no specification on how to request zero houses so this is impossible
      it('#TC-202-1 should list zero student houses', function (done) {
        done()
      });
      // There is no specification on how to request two houses so this is impossible
      it('#TC-202-2 should list two student houses', function (done) {
        done()
      });
      it('#TC-202-3 search for non existing city', function (done) {
        // Added city filter with a search on streetname
        chai.request(app)
          .get(`/api/studenthome?city=${faker.address.streetName(false)}`)
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
            done()
          });
      });
      it('#TC-202-4 search for non existing name', function (done) {
        // Added name filter with a search on streetname
        chai.request(app)
          .get(`/api/studenthome?name=${faker.address.streetName(false)}`)
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
            done()
          });
      });
      it('#TC-202-5 should list all student houses in a city', function (done) {
        chai.request(app)
          .get(`/api/studenthome?city=${collectedData.createdHouse.city}`)
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.have.property('body').to.have.property('success').to.equal(true);
            expect(res).to.have.property('body').to.have.property('houses');
            expect(res.body.houses.length >= 1).to.equal(true);
            done()
          });
      });
      it('#TC-202-6 should list all student houses with the name', function (done) {
        chai.request(app)
          .get(`/api/studenthome?name=${collectedData.createdHouse.name}`)
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.have.property('body').to.have.property('success').to.equal(true);
            expect(res).to.have.property('body').to.have.property('houses');
            expect(res.body.houses.length >= 1).to.equal(true);
            done()
          });
      });

      //Non existing test case but it as a possible path so we take it
      it('#TC-202-7 should list all student houses', function (done) {
        chai.request(app)
          .get('/api/studenthome')
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.have.property('body').to.have.property('success').to.equal(true);
            expect(res).to.have.property('body').to.have.property('houses');
            collectedData.listHouses = res.body.houses;
            done()
          });
      });
    });
    describe('#UC-203 Details of a studenthouse', function () {
      it('#TC-203-1 Non existing studenthouse', function (done) {
        // Changed houseId to a non existing one
        chai.request(app)
          .get(`/api/studenthome/${faker.datatype.number()}`)
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
            done()
          });
      });
      it('#TC-203-2 should list details of a studenthouse', function (done) {
        chai.request(app)
          .get(`/api/studenthome/${collectedData.createdHouse.id}`)
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.have.property('body').to.have.property('success').to.equal(true);
            expect(res).to.have.property('body').to.have.property('meals');
            expect(res).to.have.property('body').to.have.property('house').own.include(collectedData.createdHouse);
            expect(res).to.have.property('body').to.have.property('house').to.have.property('user_email').to.equal(collectedData.registerData.email_address)
            expect(res).to.have.property('body').to.have.property('house').to.have.property('user_fullname').to.equal(`${collectedData.registerData.firstname} ${collectedData.registerData.lastname}`);
            collectedData.houseDetails = res.body.house;
            done()
          });
      });
    });
    describe('#UC-204 Update of a studenthouse', function () {

      it('#TC-204-1 missing param', function (done) {
        // removed street param
        const house_data = {
          'name': faker.company.companyName(undefined),
          'housenumber': faker.datatype.number(),
          'postalcode': faker.address.zipCode(undefined),
          'city': faker.address.city(),
          'phonenumber': "+316 22467104"
        };
        chai.request(app)
          .put(`/api/studenthome/${collectedData.createdHouse.id}`)
          .type('form')
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .send(house_data)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
            done()
          });
      });
      it('#TC-204-2 Invalid postalcode', function (done) {
        // removed first char of postal code
        const house_data = {
          'name': faker.company.companyName(undefined),
          'street': faker.address.streetName(false),
          'housenumber': faker.datatype.number(),
          'postalcode': faker.address.zipCode(undefined).substring(1),
          'city': faker.address.city(),
          'phonenumber': "+316 22467104"
        };
        chai.request(app)
          .put(`/api/studenthome/${collectedData.createdHouse.id}`)
          .type('form')
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .send(house_data)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
            done()
          });
      });
      it('#TC-204-3 Invalid phonenumber', function (done) {
        // Removed the +316- part of the phonenumber
        const house_data = {
          'name': faker.company.companyName(undefined),
          'street': faker.address.streetName(false),
          'housenumber': faker.datatype.number(),
          'postalcode': faker.address.zipCode(undefined),
          'city': faker.address.city(),
          'phonenumber': "22467104"
        };
        chai.request(app)
          .put(`/api/studenthome/${collectedData.createdHouse.id}`)
          .type('form')
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .send(house_data)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
            done()
          });
      });
      it('#TC-204-5 Not signed in', function (done) {
        // Removed authorization part
        const house_data = {
          'name': faker.company.companyName(undefined),
          'street': faker.address.streetName(false),
          'housenumber': faker.datatype.number(),
          'postalcode': faker.address.zipCode(undefined),
          'city': faker.address.city(),
          'phonenumber': "+316 22467104"
        };
        chai.request(app)
          .put(`/api/studenthome/${collectedData.createdHouse.id}`)
          .type('form')
          .send(house_data)
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
            done()
          });
      });

      it('#TC-204-6 should update a studenthouse', function (done) {
        const house_data = {
          'name': faker.company.companyName(undefined),
          'street': faker.address.streetName(false),
          'housenumber': faker.datatype.number(),
          'postalcode': faker.address.zipCode(undefined),
          'city': faker.address.city(),
          'phonenumber': "+316 22467104"
        };
        chai.request(app)
          .put(`/api/studenthome/${collectedData.createdHouse.id}`)
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .type('form')
          .send(house_data)
          .end((err, res) => {
            expect(res).to.have.status(202);
            expect(res).to.have.property('body').to.have.property('success').to.equal(true);
            expect(res).to.have.property('body').to.have.property('house').own.include(house_data);
            expect(res).to.have.property('body').to.have.property('house').to.have.property('user_email').to.equal(collectedData.registerData.email_address)
            expect(res).to.have.property('body').to.have.property('house').to.have.property('user_fullname').to.equal(`${collectedData.registerData.firstname} ${collectedData.registerData.lastname}`);
            collectedData.updatedHouse = res.body.house;
            done()
          });
      });
    });
    describe('#UC-205 Delete a studenthouse', function () {
      if (alsoDelete) {
        it('#TC-205-0 Register a user to simulate another user', function (done) {
          const register_data = {
            'firstname': faker.name.firstName(undefined),
            'lastname': faker.name.lastName(false),
            'studentnumber': faker.datatype.number(),
            'email_address': faker.internet.email(undefined),
            'password': faker.internet.password()
          };
          chai.request(app)
            .post('/api/register')
            .type('form')
            .send(register_data)
            .end((err, res) => {
              expect(res).to.have.status(201);
              expect(res).to.have.property('body').to.have.property('success').to.equal(true);
              expect(res).to.have.property('body').to.have.property('token');
              collectedData.authToken2 = res.body.token;
              collectedData.userId2 = res.body.user_id;
              collectedData.registerData2 = register_data;
              done()
            });
        });

        it('#TC-205-1 Non existing house', function (done) {
          chai.request(app)
            .del(`/api/studenthome/${faker.datatype.number()}`)
            .set({ "Authorization": `Bearer ${collectedData.authToken}` })
            .end((err, res) => {
              expect(res).to.have.status(404);
              expect(res).to.have.property('body').to.have.property('success').to.equal(false);
              done()
            });
        });
        it('#TC-205-2 Auhtorization missing', function (done) {
          // Removed authorization header
          chai.request(app)
            .del(`/api/studenthome/${collectedData.createdHouse.id}`)
            .end((err, res) => {
              expect(res).to.have.status(401);
              expect(res).to.have.property('body').to.have.property('success').to.equal(false);
              done()
            });
        });
        it('#TC-205-3 Actor is not the owner', function (done) {
          // Changed authorization header
          chai.request(app)
            .del(`/api/studenthome/${collectedData.createdHouse.id}`)
            .set({ "Authorization": `Bearer ${collectedData.authToken2}` })
            .end((err, res) => {
              expect(res).to.have.status(401);
              expect(res).to.have.property('body').to.have.property('success').to.equal(false);
              done()
            });
        });
        it('#TC-205-4 should delete a studenthouse', function (done) {
          chai.request(app)
            .del(`/api/studenthome/${collectedData.createdHouse.id}`)
            .set({ "Authorization": `Bearer ${collectedData.authToken}` })
            .end((err, res) => {
              expect(res).to.have.status(202);
              expect(res).to.have.property('body').to.have.property('success').to.equal(true);
              expect(res).to.have.property('body').to.have.property('id').to.equal(collectedData.createdHouse.id);
              collectedData.deleteHouse = res.body.id;
              done()
            });
        });
      }
    });

    describe('#UC-206 add permissions to a studenthouse', function () {
      it('#TC-206-0 should create a studenthouse used for meal testing', function (done) {
        const house_data = {
          'name': faker.company.companyName(undefined),
          'street': faker.address.streetName(false),
          'housenumber': faker.datatype.number(),
          'postalcode': faker.address.zipCode(undefined),
          'city': faker.address.city(),
          'phonenumber': "+316 22467104"
        };
        chai.request(app)
          .post('/api/studenthome')
          .type('form')
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .send(house_data)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res).to.have.property('body').to.have.property('success').to.equal(true);
            expect(res).to.have.property('body').to.have.property('house').own.include(house_data);
            expect(res).to.have.property('body').to.have.property('house').to.have.property('user_email').to.equal(collectedData.registerData.email_address)
            expect(res).to.have.property('body').to.have.property('house').to.have.property('user_fullname').to.equal(`${collectedData.registerData.firstname} ${collectedData.registerData.lastname}`);
            collectedData.createdHouse = res.body.house;
            done()
          });
      });
      it('#TC-206-0 Register a user to simulate another user', function (done) {
        const register_data = {
          'firstname': faker.name.firstName(undefined),
          'lastname': faker.name.lastName(false),
          'studentnumber': faker.datatype.number(),
          'email_address': faker.internet.email(undefined),
          'password': faker.internet.password()
        };
        chai.request(app)
          .post('/api/register')
          .type('form')
          .send(register_data)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res).to.have.property('body').to.have.property('success').to.equal(true);
            expect(res).to.have.property('body').to.have.property('token');
            collectedData.authToken3 = res.body.token;
            collectedData.userId3 = res.body.user_id;
            collectedData.registerData3 = register_data;
            done()
          });
      });
      it('#TC-206-1 not signedin', function (done) {
        // Removed auth header
        const user_data = {
          'userId': collectedData.userId3
        };
        chai.request(app)
          .put(`/api/studenthome/${collectedData.createdHouse.id}/user`)
          .type('form')
          .send(user_data)
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
            done()
          });
      });
      it('#TC-206-2 user not found', function (done) {
        // changed user id
        const user_data = {
          'userId': faker.datatype.number()
        };
        chai.request(app)
          .put(`/api/studenthome/${collectedData.createdHouse.id}/user`)
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .type('form')
          .send(user_data)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
            done()
          });
      });
      it('#TC-206-2 student house not found', function (done) {
        // changed hgouse id
        const user_data = {
          'userId': collectedData.userId3
        };
        chai.request(app)
          .put(`/api/studenthome/${faker.datatype.number()}/user`)
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .type('form')
          .send(user_data)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
            done()
          });
      });

      it('#TC-206-4 should update a studenthouse', function (done) {
        const user_data = {
          'userId': collectedData.userId3
        };
        chai.request(app)
          .put(`/api/studenthome/${collectedData.createdHouse.id}/user`)
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .type('form')
          .send(user_data)
          .end((err, res) => {
            expect(res).to.have.status(202);
            expect(res).to.have.property('body').to.have.property('success').to.equal(true);
            done()
          });
      });
    });
  });
  describe('Studenthouse Meals', function () {
    // Create a student house for testing since the last one was deleted
    it('#TC-300-0 should create a studenthouse used for meal testing', function (done) {
      const house_data = {
        'name': faker.company.companyName(undefined),
        'street': faker.address.streetName(false),
        'housenumber': faker.datatype.number(),
        'postalcode': faker.address.zipCode(undefined),
        'city': faker.address.city(),
        'phonenumber': "+316 22467104"
      };
      chai.request(app)
        .post('/api/studenthome')
        .type('form')
        .set({ "Authorization": `Bearer ${collectedData.authToken}` })
        .send(house_data)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res).to.have.property('body').to.have.property('success').to.equal(true);
          expect(res).to.have.property('body').to.have.property('house').own.include(house_data);
          expect(res).to.have.property('body').to.have.property('house').to.have.property('user_email').to.equal(collectedData.registerData.email_address)
          expect(res).to.have.property('body').to.have.property('house').to.have.property('user_fullname').to.equal(`${collectedData.registerData.firstname} ${collectedData.registerData.lastname}`);
          collectedData.createdHouse = res.body.house;
          done()
        });
    });
    describe('#UC-301 Creation of a meal', function () {
      it('#TC-301-1 missing param', function (done) {
        // Removed name param
        const date = faker.date.past(undefined, undefined);
        date.setMilliseconds(0);
        const meal_data = {
          'description': faker.commerce.productDescription(),
          'price': faker.datatype.number(),
          'allergies': JSON.stringify([faker.commerce.productMaterial(), faker.commerce.productMaterial()]),
          'ingredients': JSON.stringify([faker.animal.cow(), faker.animal.horse(), faker.animal.fish(), faker.animal.rabbit()]),
          'offered_since': date.toISOString()
        };
        chai.request(app)
          .post(`/api/studenthome/${collectedData.createdHouse.id}/meal/`)
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
          'name': faker.commerce.productName(),
          'description': faker.commerce.productDescription(),
          'price': faker.datatype.number(),
          'allergies': JSON.stringify([faker.commerce.productMaterial(), faker.commerce.productMaterial()]),
          'ingredients': JSON.stringify([faker.animal.cow(), faker.animal.horse(), faker.animal.fish(), faker.animal.rabbit()]),
          'offered_since': date.toISOString()
        };
        chai.request(app)
          .post(`/api/studenthome/${collectedData.createdHouse.id}/meal/`)
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
          'name': faker.commerce.productName(),
          'description': faker.commerce.productDescription(),
          'price': faker.datatype.number(),
          'allergies': JSON.stringify([faker.commerce.productMaterial(), faker.commerce.productMaterial()]),
          'ingredients': JSON.stringify([faker.animal.cow(), faker.animal.horse(), faker.animal.fish(), faker.animal.rabbit()]),
          'offered_since': date.toISOString()
        };
        chai.request(app)
          .post(`/api/studenthome/${collectedData.createdHouse.id}/meal/`)
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .type('form')
          .send(meal_data)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res).to.have.property('body').to.have.property('success').to.equal(true);
            expect(res).to.have.property('body').to.have.property('meal').own.include(meal_data);
            expect(res).to.have.property('body').to.have.property('meal').to.have.property('user_email').to.equal(collectedData.registerData.email_address)
            expect(res).to.have.property('body').to.have.property('meal').to.have.property('user_fullname').to.equal(`${collectedData.registerData.firstname} ${collectedData.registerData.lastname}`);
            collectedData.createdMeal = res.body.meal;
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
          'name': faker.commerce.productName(),
          'price': faker.datatype.number(),
          'allergies': JSON.stringify([faker.commerce.productMaterial(), faker.commerce.productMaterial()]),
          'ingredients': JSON.stringify([faker.animal.cow(), faker.animal.horse(), faker.animal.fish(), faker.animal.rabbit()]),
          'offered_since': date.toISOString()
        };
        chai.request(app)
          .put(`/api/studenthome/${collectedData.createdHouse.id}/meal/${collectedData.createdMeal.id}`)
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
          'name': faker.commerce.productName(),
          'description': faker.commerce.productDescription(),
          'price': faker.datatype.number(),
          'allergies': JSON.stringify([faker.commerce.productMaterial(), faker.commerce.productMaterial()]),
          'ingredients': JSON.stringify([faker.animal.cow(), faker.animal.horse(), faker.animal.fish(), faker.animal.rabbit()]),
          'offered_since': date.toISOString()
        };
        chai.request(app)
          .put(`/api/studenthome/${collectedData.createdHouse.id}/meal/${collectedData.createdMeal.id}`)
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
          'name': faker.commerce.productName(),
          'description': faker.commerce.productDescription(),
          'price': faker.datatype.number(),
          'allergies': JSON.stringify([faker.commerce.productMaterial(), faker.commerce.productMaterial()]),
          'ingredients': JSON.stringify([faker.animal.cow(), faker.animal.horse(), faker.animal.fish(), faker.animal.rabbit()]),
          'offered_since': date.toISOString()
        };
        chai.request(app)
          .put(`/api/studenthome/${collectedData.createdHouse.id}/meal/${collectedData.createdMeal.id}`)
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
          'name': faker.commerce.productName(),
          'description': faker.commerce.productDescription(),
          'price': faker.datatype.number(),
          'allergies': JSON.stringify([faker.commerce.productMaterial(), faker.commerce.productMaterial()]),
          'ingredients': JSON.stringify([faker.animal.cow(), faker.animal.horse(), faker.animal.fish(), faker.animal.rabbit()]),
          'offered_since': date.toISOString()
        };
        chai.request(app)
          .put(`/api/studenthome/${collectedData.createdHouse.id}/meal/${faker.datatype.number()}`)
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
          'name': faker.commerce.productName(),
          'description': faker.commerce.productDescription(),
          'price': faker.datatype.number(),
          'allergies': JSON.stringify([faker.commerce.productMaterial(), faker.commerce.productMaterial()]),
          'ingredients': JSON.stringify([faker.animal.cow(), faker.animal.horse(), faker.animal.fish(), faker.animal.rabbit()]),
          'offered_since': date.toISOString()
        };
        chai.request(app)
          .put(`/api/studenthome/${collectedData.createdHouse.id}/meal/${collectedData.createdMeal.id}`)
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .type('form')
          .send(meal_data)
          .end((err, res) => {
            expect(res).to.have.status(202);
            expect(res).to.have.property('body').to.have.property('success').to.equal(true);
            expect(res).to.have.property('body').to.have.property('meal').own.include(meal_data);
            expect(res).to.have.property('body').to.have.property('meal').to.have.property('user_email').to.equal(collectedData.registerData.email_address)
            expect(res).to.have.property('body').to.have.property('meal').to.have.property('user_fullname').to.equal(`${collectedData.registerData.firstname} ${collectedData.registerData.lastname}`);
            collectedData.createdMeal = res.body.meal;
            done()
          });
      });
    });

    describe('#UC-303 List meals', function () {
      it('#TC-303-1 should list all meals', function (done) {
        chai.request(app)
          .get('/api/studenthome/${collectedData.createdHouse.id}/meal/')
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.have.property('body').to.have.property('success').to.equal(true);
            expect(res).to.have.property('body').to.have.property('meals');
            collectedData.listMeals = res.body.meals;
            done()
          });
      });
    });
    describe('#UC-304 Details of a meal', function () {
      it('#TC-304-1 non existing mealId', function (done) {
        // Changed mealId to a non-existing one
        chai.request(app)
          .get(`/api/studenthome/${collectedData.createdHouse.id}/meal/${faker.datatype.number()}`)
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res).to.have.property('body').to.have.property('success').to.equal(false);
            done()
          });
      });

      it('#TC-304-2 should list details of a meal', function (done) {
        chai.request(app)
          .get(`/api/studenthome/${collectedData.createdHouse.id}/meal/${collectedData.createdMeal.id}`)
          .set({ "Authorization": `Bearer ${collectedData.authToken}` })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.have.property('body').to.have.property('success').to.equal(true);
            expect(res).to.have.property('body').to.have.property('meal').own.include(collectedData.createdMeal);
            expect(res).to.have.property('body').to.have.property('meal').to.have.property('user_email').to.equal(collectedData.registerData.email_address)
            expect(res).to.have.property('body').to.have.property('meal').to.have.property('user_fullname').to.equal(`${collectedData.registerData.firstname} ${collectedData.registerData.lastname}`);
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
            .del(`/api/studenthome/${collectedData.createdHouse.id}/meal/${faker.datatype.number()}`)
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
            .del(`/api/studenthome/${collectedData.createdHouse.id}/meal/${collectedData.createdMeal.id}`)
            .end((err, res) => {
              expect(res).to.have.status(401);
              expect(res).to.have.property('body').to.have.property('success').to.equal(false);
              done()
            });
        });
        it('#TC-305-3 Actor is not the owner', function (done) {
          // Changed authorization header
          chai.request(app)
            .del(`/api/studenthome/${collectedData.createdHouse.id}/meal/${collectedData.createdMeal.id}`)
            .set({ "Authorization": `Bearer ${collectedData.authToken2}` })
            .end((err, res) => {
              expect(res).to.have.status(401);
              expect(res).to.have.property('body').to.have.property('success').to.equal(false);
              done()
            });
        });
        it('#TC-305-1 should delete a meal', function (done) {
          chai.request(app)
            .del(`/api/studenthome/${collectedData.createdHouse.id}/meal/${collectedData.createdMeal.id}`)
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
  });
});

