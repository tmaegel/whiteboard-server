'use strict';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

// to prevent DEPTH_ZERO_SELF_SIGNED_CERT"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let server = "https://localhost:3000";
let user = {
    name: "user",
    password: "2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b"
};

describe('authentication.js', () => {
    describe('#POST /authentication/login', function() {
        it('it should login the user and return a valid token (200 OK)', (done) => {
            chai.request(server)
            .post('/authentication/login')
            .send(user)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                res.body.should.have.property('type').eql('SUCCESS');
                res.body.should.have.property('message').eql('User login successfully');
                res.body.should.have.property('token');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the username is null', (done) => {
            let invalidUser = {
                name: "",
                password: "2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b"
            };
            chai.request(server)
            .post('/authentication/login')
            .send(invalidUser)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('username or password are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the password is null', (done) => {
            let invalidUser = {
                name: "user",
                password: ""
            };
            chai.request(server)
            .post('/authentication/login')
            .send(invalidUser)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('username or password are invalid');
                done();
            });
        });
        it('it should return an error (403 Forbidden) when the username is invalid', (done) => {
            let invalidUser = {
                name: "user123",
                password: "2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b"
            };
            chai.request(server)
            .post('/authentication/login')
            .send(invalidUser)
            .end(function(err, res) {
                expect(res).to.have.status(403);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('username is invalid');
                done();
            });
        });
        it('it should return an error (403 Forbidden) when the password is invalid', (done) => {
            let invalidUser = {
                name: "user",
                password: "2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a2XX"
            };
            chai.request(server)
            .post('/authentication/login')
            .send(invalidUser)
            .end(function(err, res) {
                expect(res).to.have.status(403);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('password is invalid');
                done();
            });
        });
    });
    describe('#GET /authentication/validate', function() {
        let token;
        before(function(done) { // runs before all tests in this block
            chai.request(server)
            .post('/authentication/login')
            .send(user)
            .end(function(err, res) {
                token = res.body.token;
                done();
            });
        });
        it('it should validate the user and return a valid token (200 OK)', (done) => {
            chai.request(server)
            .get('/authentication/validate')
            .set('Authorization', token)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                res.body.should.have.property('sub');
                res.body.should.have.property('name').eql('user');
                res.body.should.have.property('iat');
                res.body.should.have.property('exp');
                done();
            });
        });
        it('it should return an error (401 Unauthorized) when the token is null', (done) => {
            chai.request(server)
            .get('/authentication/validate')
            .end(function(err, res) {
                expect(res).to.have.status(401);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('No token provided');
                done();
            });
        });
        it('it should return an error (401 Unauthorized) when the token is invalid', (done) => {
            let invalidToken = "2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25X";
            chai.request(server)
            .get('/authentication/validate')
            .set('Authorization', invalidToken)
            .end(function(err, res) {
                expect(res).to.have.status(401);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('Failed to authenticate token');
                done();
            });
        });
    });
});
