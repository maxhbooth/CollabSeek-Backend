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

  describe('/POST register', () => {
    it('it should Post a user to register', (done) => {
      chai.request(server)
          .post('/register')
          .type('form')
          .send({
            '_method': 'post',
            'password': '12345',
            'repassword': '12345',
            'username': 'testuser',
            'email' : 'testemail@test.email.com'
          })
          .end((err, res) => {
              

              res.should.have.status(200);
            done();
          });
    });
});

});