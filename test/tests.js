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
// describe('Search', () => {
//   describe('/GET create-user', () => {
//       it('it should GET all the users', (done) => {
//         chai.request(server)
//             .get('/create-user')
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 res.text.should.be.eql('Hello world!');
//                 res.text.length.should.be.eql(12);
//               done();
//             });
//       });
//   });
// });

describe('homepage', () => {
    it('it should respond to get', function(done) {
       chai.request(server)
           .get('/')
           .end(function(err, res) {
               res.should.have.status(200);
               done();
           });
    });
});

describe('profile', () => {
    it('it should respond with 404 to unauthorized get', function(done) {
        chai.request(server)
            .get('/profile')
            .end(function(res) {
                res.should.have.status(404);
                done();
            });
    });
});