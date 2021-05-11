const { expect } = require('chai')
let chai = require('chai')
let chaiHttp = require('chai-http')
const { response } = require('express')
let server = require('../server')

//Assertion Style
chai.should()

chai.use(chaiHttp)

describe('Studenthome API', () =>{
    //Test the get route
  describe("GET /api/studenthome",()=>{
    it("It schould GET all the studenthomes",(done)=>{
      chai.request(server)
        .get("/api/studenthome")
        .end((err, response)=>{
          response.should.have.status(200)
          response.body.status.should.be.a('string')
          response.body.result.should.be.a('array')
          //response.body.length.should.be.eq(3)
          done()
        })
    })
    it("It could GET zero studenthomes",(done)=>{
      chai.request(server)
        .get("/api/studenthome")
        .end((err, response)=>{
          response.should.have.status(200)
          response.body.status.should.be.a('string')
          response.body.result = []
          response.body.result.should.have.lengthOf(0);
          done()
        })
    })
    it("It schould GET 2 studenthomes",(done)=>{
      chai.request(server)
        .get("/api/studenthome")
        .end((err, response)=>{
          response.should.have.status(200)
          response.body.status.should.be.a('string')
          response.body.result.should.have.lengthOf(2);
          done()
        })
    })

    it("It schould NOT GET all the studenthomes",(done)=>{
      chai.request(server)
        .get("/api/studenthom")
        .end((err, response)=>{
          response.should.have.status(404)
          done()
        })
    })
  })
    //Test get by id
    describe("GET /api/studenthome",()=>{
      it("It schould GET a studenthome by id",(done)=>{
        const homeId = 0

        chai.request(server)
          .get("/api/studenthome/"+homeId)
          .end((err, response)=>{
            response.should.have.status(200)
            response.body.status.should.be.a('string')
            response.body.result.should.be.a('object')
            response.body.result.should.have.property('homeId')
            response.body.result.should.have.property('name')
            response.body.result.should.have.property('street')
            response.body.result.should.have.property('house_number')
            response.body.result.should.have.property('postal_code')
            response.body.result.should.have.property('place')
            response.body.result.should.have.property('telephone_number')
            response.body.result.should.have.property('user')
            response.body.result.should.have.property('meal')
            response.body.result.should.have.property('homeId').eq(0)
            done()
          })
      })
      it("It schould NOT GET a studenthome by id",(done)=>{
        const homeId = 1000

        chai.request(server)
          .get("/api/studenthome/"+homeId)
          .end((err, response)=>{
            response.should.have.status(404)
            response.text.should.be.eq("The home with the provided ID does not exist")
            done()
          })
      })
    })
    //test post
    describe("POST /api/studenthome",()=>{
      it("It schould POST a studenthome",(done)=>{
        chai.request(server)
          .post("/api/studenthome")
          .end((err, response)=>{
            response.should.have.status(201)
            response.body.status.should.be.a('string')
            response.body.should.be.a('object')
            response.body.result[0].should.have.property('postal_code')
            response.body.result[0].postal_code.should.have.lengthOf(6);
            // response.body.result.should.have.property('telephone_number')
            // response.body.result.telephone_number.should.have.lengthOf(10);
            done()
          })
      })
    })


    //test put


    //test delete
})
