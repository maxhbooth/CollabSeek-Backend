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
  var randomstring = Math.random().toString(36).substr(2, 5);
  it('it should Post a user to register', (done) => {
    chai.request(server)
        .post('/register')
        .type('form')
        .send({
          '_method': 'post',
          'password': '12345',
          'repassword': '12345',
          'username': 'testuser' + randomstring,
          'email' : 'testemail' + randomstring + '@test.email.com'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.eql('registration complete');
          done();
        });
  });
});

describe('/POST register', () => {
  var randomstring = Math.random().toString(36).substr(2, 5);
  it('it should Post a user to register and fail', (done) => {
    chai.request(server)
        .post('/register')
        .type('form')
        .send({
          '_method': 'post',
          'password': '12345',
          'repassword': '',
          'username': 'testuser' + randomstring,
          'email' : 'testemail' + randomstring + '@test.email.com'
        })
        .end((err, res) => {
          //console.log(JSON.parse(res.text)[0].msg);
          res.should.have.status(200);
          JSON.parse(res.text)[0].msg.should.be.eql('Passwords must match.');
          done();
        });
  });
});

describe('/POST register', () => {
  var randomstring = Math.random().toString(36).substr(2, 5);
  it('it should Post a user to register and fail', (done) => {
    chai.request(server)
        .post('/register')
        .type('form')
        .send({
          '_method': 'post',
          'password': '12345',
          'repassword': '12345',
          'username': 'tes',
          'email' : 'tt.email.com'
        })
        .end((err, res) => {
          //console.log(JSON.parse(res.text)[0].msg);
          res.should.have.status(200);
          JSON.parse(res.text)[0].msg.should.be.eql('Username must be between 4 and 15 characters.');
          JSON.parse(res.text)[1].msg.should.be.eql('Email must be a valid email.');
          done();
        });
  });
});