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

describe('movement.js', () => {
    /**
     * Testing #GET /movement
     */
    describe('#GET /movement', function() {
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
        /**
         * Positive tests #GET /movement
         */
        describe('#GET /movement (positive tests)', function() {
            it('it should return all the movements', function(done) {
                chai.request(server)
                .get('/movement')
                .set('Authorization', token)
                .end(function(err, res) {
                    let parsedRes = JSON.parse(res.text);
                    expect(res).to.have.status(200);
                    expect(parsedRes[0]).to.have.property('id');
                    expect(parsedRes[0]).to.have.property('movement');
                    expect(parsedRes[0]).to.have.property('equipmentIds');
                    expect(parsedRes[1]).to.have.property('id');
                    expect(parsedRes[1]).to.have.property('movement');
                    expect(parsedRes[1]).to.have.property('equipmentIds');
                    done();
                });
            });
        });
        /**
         * negative tests #GET /movement
         */
        describe('#GET /movement (negative tests)', function() {
            it('it should return an error (401 Unauthorized) if the token is null/undefined', function(done) {
                chai.request(server)
                .get('/movement')
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('No token provided');
                    done();
                });
            });
            it('it should return an error (401 Unauthorized) if the token is invalid', function(done) {
                let invalidToken = "2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25X";
                chai.request(server)
                .get('/movement')
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
});
