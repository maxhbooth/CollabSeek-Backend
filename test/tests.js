"use strict";
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Books', () => {
    // beforeEach((done) => { //Before each test we empty the database
    //     Book.remove({}, (err) => { 
    //        done();         
    //     });     
    // });
/*
  * Test the /GET route
  */
  describe('/GET create-user', () => {
      it('it should GET all the users', (done) => {
        chai.request(server)
            .get('/create-user')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.be.eql('Hello world!');
                res.text.length.should.be.eql(12);
              done();
            });
      });
  });

});