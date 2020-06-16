'use strict';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

// to prevent DEPTH_ZERO_SELF_SIGNED_CERT"
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let server = "http://localhost:3000";
let user = {
    name: "user",
    password: "2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b"
};

describe('tag.js', () => {
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
     * Testing #GET /tag
     */
    describe('#GET /tag', function() {
        /**
         * Positive tests #GET /tag
         */
        describe('#GET /tag (positive tests)', function() {
            it('it should return all the tags', function(done) {
                chai.request(server)
                .get('/tag')
                .set('Authorization', token)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    let parsedRes = JSON.parse(res.text);
                    expect(parsedRes[0]).to.have.property('id');
                    expect(parsedRes[0]).to.have.property('userId');
                    expect(parsedRes[0]).to.have.property('tag');
                    expect(parsedRes[1]).to.have.property('id');
                    expect(parsedRes[1]).to.have.property('userId');
                    expect(parsedRes[1]).to.have.property('tag');
                    done();
                });
            });
        });
        /**
         * Negative tests #GET /tag
         */
        describe('#GET /tag (negative tests)', function() {
            it('it should return an error (401 Unauthorized) if the token is null/undefined', function(done) {
                chai.request(server)
                .get('/tag')
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
                .get('/tag')
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
    /**
     * Testing #GET /tag/:tagId
     */
    describe('#GET /tag/:tagId', function() {
        /**
         * Positive tests #GET /tag/:tagId
         */
        describe('#GET /tag/:tagId (positive tests)', function() {
            it('it should return the tag with id', function(done) {
                chai.request(server)
                .get('/tag/1')
                .set('Authorization', token)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    let parsedRes = JSON.parse(res.text);
                    expect(parsedRes).to.have.property('id').eql(1);
                    expect(parsedRes).to.have.property('userId');
                    expect(parsedRes).to.have.property('tag');
                    done();
                });
            });
            it('it should return no tag but the status (204 No Content) if no tag was found with id', function(done) {
                chai.request(server)
                .get('/tag/9999')
                .set('Authorization', token)
                .end(function(err, res) {
                    expect(res).to.have.status(204);
                    done();
                });
            });
        });
        /**
         * Negative tests #GET /tag/:tagId
         */
        describe('#GET /tag/:tagId (negative tests)', function() {
            it('it should return an error (400 Bad Request) if the id is invalid', function(done) {
                chai.request(server)
                .get('/tag/a')
                .set('Authorization', token)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('tag id is invalid');
                    done();
                });
            });
            it('it should return an error (401 Unauthorized) if the token is null/undefined', function(done) {
                chai.request(server)
                .get('/tag/1')
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
                .get('/tag/1')
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
    /**
     * Testing #POST /tag
     */
    describe('#POST /tag', function() {
        /**
         * Positive tests #POST /tag
         */
        describe('#POST /tag (positive tests)', function() {
            it('it should save the tag', function(done) {
                let tag = {
                    tag: "Tag 123"
                };
                chai.request(server)
                .post('/tag')
                .set('Authorization', token)
                .send(tag)
                .end(function(err, res) {
                    expect(res).to.have.status(201);
                    let parsedRes = JSON.parse(res.text);
                    expect(parsedRes).to.have.property('id');
                    expect(parsedRes).to.have.property('userId');
                    expect(parsedRes).to.have.property('tag').eql('Tag 123');
                    done();
                });
            });
        });
        /**
         * Negative tests #POST /tag
         */
        describe('#POST /tag (negative tests)', function() {
            it('it should return an error (400 Bad Request) if the tag name is null/undefined', function(done) {
                let invalidTag = {  };
                chai.request(server)
                .post('/tag')
                .set('Authorization', token)
                .send(invalidTag)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('tag name is invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the tag name is empty', function(done) {
                let invalidTag = {
                    name: ""
                };
                chai.request(server)
                .post('/tag')
                .set('Authorization', token)
                .send(invalidTag)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('tag name is invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the tag name is invalid', function(done) {
                let invalidTag = {
                    name: "Name A$"
                };
                chai.request(server)
                .post('/tag')
                .set('Authorization', token)
                .send(invalidTag)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('tag name is invalid');
                    done();
                });
            });
            it('it should return an error (401 Unauthorized) if the token is null/undefined', function(done) {
                chai.request(server)
                .post('/tag')
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
                .post('/tag')
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
    /**
     * Testing #POST /tag/:tagId
     */
    describe('#POST /tag/:tagId', function() {
        /**
         * Positive tests #POST /tag/:tagId
         */
        describe('#POST /tag/:tagId (positive tests)', function() {
            let tagId, userId;
            before(function(done) { // runs before all tests in this block
                // Inserted real tag before updating
                let tag = {
                    tag: "Tag 999"
                };
                chai.request(server)
                .post('/tag')
                .set('Authorization', token)
                .send(tag)
                .end(function(err, res) {
                    tagId = parseInt(JSON.parse(res.text).id);
                    userId = parseInt(JSON.parse(res.text).userId);
                    done();
                });
            });
            it('it should update the tag', function(done) {
                let updateTag = {
                    tag: "Tag ABC"
                };
                chai.request(server)
                .post('/tag/' + tagId) // update the inserted tag
                .set('Authorization', token)
                .send(updateTag)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    let parsedRes = JSON.parse(res.text);
                    expect(parsedRes).to.have.property('id').eql(tagId);
                    expect(parsedRes).to.have.property('userId').eql(userId);
                    expect(parsedRes).to.have.property('tag').eql('Tag ABC');
                    done();
                });
            });
            it('it should ignore the userId and update the tag', function(done) {
                let updateTag = {
                    userId: 99,
                    tag: "TAG ABC"
                };
                chai.request(server)
                .post('/tag/' + tagId) // update the inserted tag
                .set('Authorization', token)
                .send(updateTag)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    let parsedRes = JSON.parse(res.text);
                    expect(parsedRes).to.have.property('id').eql(tagId);
                    expect(parsedRes).to.have.property('userId').eql(userId);
                    expect(parsedRes).to.have.property('tag').eql('TAG ABC');
                    done();
                });
            });
        });
        /**
         * Negative tests #POST /tag/:tagId
         */
        describe('#POST /tag/:tagId (negative tests)', function() {
            it('it should return an error (400 Bad Request) if the tag name is null/undefined', function(done) {
                let invalidTag = {  };
                chai.request(server)
                .post('/tag/1')
                .set('Authorization', token)
                .send(invalidTag)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('tag id or name are invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the tag name is empty', function(done) {
                let invalidTag = {
                    name: ""
                };
                chai.request(server)
                .post('/tag/1')
                .set('Authorization', token)
                .send(invalidTag)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('tag id or name are invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the id is invalid', function(done) {
                let valid = {
                    name: "Tag ABC"
                };
                chai.request(server)
                .post('/tag/a')
                .set('Authorization', token)
                .send(valid)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('tag id or name are invalid');
                    done();
                });
            });
            it('it should return an error (404 Not Found) if no tag was found with id', function(done) {
                let valid = {
                    tag: "Tag ABC"
                };
                chai.request(server)
                .post('/tag/999999')
                .set('Authorization', token)
                .send(valid)
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('No tag found with the id');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the tag name is invalid', function(done) {
                let invalidTag = {
                    tag: "Name A$",
                };
                chai.request(server)
                .post('/tag/1')
                .set('Authorization', token)
                .send(invalidTag)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('tag id or name are invalid');
                    done();
                });
            });
            it('it should return an error (401 Unauthorized) if the token is null/undefined', function(done) {
                chai.request(server)
                .post('/tag/1')
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
                .post('/tag/1')
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
