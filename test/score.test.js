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

describe('score.js', () => {
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
    describe('#GET /score', function() {
        it('it should return all the scores', function(done) {
            chai.request(server)
            .get('/score')
            .set('Authorization', token)
            .end(function(err, res) {
                let parsedRes = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(parsedRes[0]).to.have.property('id');
                expect(parsedRes[0]).to.have.property('userId');
                expect(parsedRes[0]).to.have.property('workoutId');
                expect(parsedRes[0]).to.have.property('score');
                expect(parsedRes[0]).to.have.property('rx');
                expect(parsedRes[0]).to.have.property('datetime');
                expect(parsedRes[0]).to.have.property('note');
                expect(parsedRes[1]).to.have.property('id');
                expect(parsedRes[1]).to.have.property('userId');
                expect(parsedRes[1]).to.have.property('workoutId');
                expect(parsedRes[1]).to.have.property('score');
                expect(parsedRes[1]).to.have.property('rx');
                expect(parsedRes[1]).to.have.property('datetime');
                expect(parsedRes[1]).to.have.property('note');
                done();
            });
        });
        it('it should return an error (401 Unauthorized) when the token is null', function(done) {
            chai.request(server)
            .get('/score')
            .end(function(err, res) {
                expect(res).to.have.status(401);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('No token provided');
                done();
            });
        });
        it('it should return an error (401 Unauthorized) when the token is invalid', function(done) {
            let invalidToken = "2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25X";
            chai.request(server)
            .get('/score')
            .set('Authorization', invalidToken)
            .end(function(err, res) {
                expect(res).to.have.status(401);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('Failed to authenticate token');
                done();
            });
        });
    });
    describe('#GET /score/:scoreId', function() {
        it('it should return the score with id', function(done) {
            chai.request(server)
            .get('/score/1')
            .set('Authorization', token)
            .end(function(err, res) {
                let parsedRes = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(parsedRes).to.have.property('id');
                expect(parsedRes).to.have.property('userId');
                expect(parsedRes).to.have.property('workoutId');
                expect(parsedRes).to.have.property('score');
                expect(parsedRes).to.have.property('rx');
                expect(parsedRes).to.have.property('datetime');
                expect(parsedRes).to.have.property('note');
                done();
            });
        });
        it('it should return the status (204 No Content) when no score was found with id', function(done) {
            chai.request(server)
            .get('/score/9999')
            .set('Authorization', token)
            .end(function(err, res) {
                expect(res).to.have.status(204);
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the id is invalid', function(done) {
            chai.request(server)
            .get('/score/a')
            .set('Authorization', token)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('scoreId is invalid');
                done();
            });
        });
        it('it should return an error (401 Unauthorized) when the token is null', function(done) {
            chai.request(server)
            .get('/score/1')
            .end(function(err, res) {
                expect(res).to.have.status(401);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('No token provided');
                done();
            });
        });
        it('it should return an ertheror (401 Unauthorized) when the token is invalid', function(done) {
            let invalidToken = "2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25X";
            chai.request(server)
            .get('/score/1')
            .set('Authorization', invalidToken)
            .end(function(err, res) {
                expect(res).to.have.status(401);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('Failed to authenticate token');
                done();
            });
        });
    });
    describe('#POST /score', function() {
        it('it should save the score', function(done) {
            let score = {
                workoutId: 1,
                score: "100",
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(score)
            .end(function(err, res) {
                let parsedRes = JSON.parse(res.text);
                expect(res).to.have.status(201);
                expect(parsedRes).to.have.property('id');
                expect(parsedRes).to.have.property('userId');
                expect(parsedRes).to.have.property('workoutId').eql(1);
                expect(parsedRes).to.have.property('score').eql('100');
                expect(parsedRes).to.have.property('rx').eql(1);
                expect(parsedRes).to.have.property('datetime').eql(1234567890);
                expect(parsedRes).to.have.property('note').eql('Note ABC');
                done();
            });
        });
        it('it should save the score when the note is empty', function(done) {
            let score = {
                workoutId: 1,
                score: "100",
                rx: 1,
                note: "",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(score)
            .end(function(err, res) {
                let parsedRes = JSON.parse(res.text);
                expect(res).to.have.status(201);
                expect(parsedRes).to.have.property('id');
                expect(parsedRes).to.have.property('workoutId').eql(1);
                expect(parsedRes).to.have.property('score').eql('100');
                expect(parsedRes).to.have.property('rx').eql(1);
                expect(parsedRes).to.have.property('datetime').eql(1234567890);
                expect(parsedRes).to.have.property('note').eql('');
                done();
            });
        });
        it('it should save the score when the score has a valid timestamp format', function(done) {
            let score = {
                workoutId: 1,
                score: "00:09:10",
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(score)
            .end(function(err, res) {
                let parsedRes = JSON.parse(res.text);
                expect(res).to.have.status(201);
                expect(parsedRes).to.have.property('id');
                expect(parsedRes).to.have.property('workoutId').eql(1);
                expect(parsedRes).to.have.property('score').eql('00:09:10');
                expect(parsedRes).to.have.property('rx').eql(1);
                expect(parsedRes).to.have.property('datetime').eql(1234567890);
                expect(parsedRes).to.have.property('note').eql('Note ABC');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the workoutId is undefined/null', function(done) {
            let invalidScore = {
                score: "100",
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the score is undefined/null', function(done) {
            let invalidScore = {
                workoutId: 1,
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the rx is undefined/null', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "100",
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the note is undefined/null', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "100",
                rx: 1,
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the datetime is undefined/null', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "100",
                rx: 1,
                note: "Note ABC"
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the workoutId is empty', function(done) {
            let invalidScore = {
                workoutId: "",
                score: "100",
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the score is empty', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "",
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the rx is empty', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "100",
                rx: "",
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the datetime is empty', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "100",
                rx: 1,
                note: "Note ABC",
                datetime: ""
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the workoutId is invalid', function(done) {
            let invalidScore = {
                workoutId: "a",
                score: "100",
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the score is invalid', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "abc",
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the score has a invalid timestamp format', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "00:10:00:12",
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the rx is invalid', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "100",
                rx: true,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the note is invalid', function(done) {
            let score = {
                workoutId: 1,
                score: "100",
                rx: 1,
                note: "$<>",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(score)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the datetime is invalid', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "100",
                rx: 1,
                note: "Note ABC",
                datetime: "00:10:00"
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (401 Unauthorized) when the token is null', function(done) {
            chai.request(server)
            .post('/workout')
            .end(function(err, res) {
                expect(res).to.have.status(401);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('No token provided');
                done();
            });
        });
        it('it should return an error (401 Unauthorized) when the token is invalid', function(done) {
            let invalidToken = "2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25X";
            chai.request(server)
            .post('/score')
            .set('Authorization', invalidToken)
            .end(function(err, res) {
                expect(res).to.have.status(401);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('Failed to authenticate token');
                done();
            });
        });
    });
    describe('#POST /score/:scoreId', function() {
        let scoreId, userId;
        before(function(done) { // runs before all tests in this block
            // Inserted real score before updating
            let score = {
                workoutId: 2,
                score: "999",
                rx: 0,
                note: "Note XYZ",
                datetime: "9876543210"
            };
            chai.request(server)
            .post('/score')
            .set('Authorization', token)
            .send(score)
            .end(function(err, res) {
                let parsedRes = JSON.parse(res.text);
                scoreId = parseInt(JSON.parse(res.text).id);
                userId = parseInt(JSON.parse(res.text).userId);
                done();
            });
        });
        it('it should update the score', function(done) {
            let score = {
                workoutId: 3,
                score: "100",
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score/' + scoreId)
            .set('Authorization', token)
            .send(score)
            .end(function(err, res) {
                let parsedRes = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(parsedRes).to.have.property('id').eql(scoreId);
                expect(parsedRes).to.have.property('userId');
                expect(parsedRes).to.have.property('workoutId').eql(3);
                expect(parsedRes).to.have.property('score').eql('100');
                expect(parsedRes).to.have.property('rx').eql(1);
                expect(parsedRes).to.have.property('datetime').eql(1234567890);
                expect(parsedRes).to.have.property('note').eql('Note ABC');
                done();
            });
        });
        it('it should update the score when the note is empty', function(done) {
            let score = {
                workoutId: 1,
                score: "100",
                rx: 1,
                note: "",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score/' + scoreId)
            .set('Authorization', token)
            .send(score)
            .end(function(err, res) {
                let parsedRes = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(parsedRes).to.have.property('id');
                expect(parsedRes).to.have.property('workoutId').eql(1);
                expect(parsedRes).to.have.property('score').eql('100');
                expect(parsedRes).to.have.property('rx').eql(1);
                expect(parsedRes).to.have.property('datetime').eql(1234567890);
                expect(parsedRes).to.have.property('note').eql('');
                done();
            });
        });
        it('it should update the score when the score has a valid timestamp format', function(done) {
            let score = {
                workoutId: 1,
                score: "00:09:10",
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score/' + scoreId)
            .set('Authorization', token)
            .send(score)
            .end(function(err, res) {
                let parsedRes = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(parsedRes).to.have.property('id');
                expect(parsedRes).to.have.property('workoutId').eql(1);
                expect(parsedRes).to.have.property('score').eql('00:09:10');
                expect(parsedRes).to.have.property('rx').eql(1);
                expect(parsedRes).to.have.property('datetime').eql(1234567890);
                expect(parsedRes).to.have.property('note').eql('Note ABC');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the workoutId is undefined/null', function(done) {
            let invalidScore = {
                score: "100",
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score/1')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('scoreId, workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the score is undefined/null', function(done) {
            let invalidScore = {
                workoutId: 1,
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score/1')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('scoreId, workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the rx is undefined/null', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "100",
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score/1')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('scoreId, workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the note is undefined/null', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "100",
                rx: 1,
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score/1')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('scoreId, workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the datetime is undefined/null', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "100",
                rx: 1,
                note: "Note ABC"
            };
            chai.request(server)
            .post('/score/1')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('scoreId, workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the workoutId is empty', function(done) {
            let invalidScore = {
                workoutId: "",
                score: "100",
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score/1')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('scoreId, workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the score is empty', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "",
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score/1')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('scoreId, workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the rx is empty', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "100",
                rx: "",
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score/1')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('scoreId, workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the datetime is empty', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "100",
                rx: 1,
                note: "Note ABC",
                datetime: ""
            };
            chai.request(server)
            .post('/score/1')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('scoreId, workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the id is invalid', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "100",
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score/a')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('scoreId, workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when no score was found with id', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "100",
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score/999999')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(204);
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the workoutId is invalid', function(done) {
            let invalidScore = {
                workoutId: "a",
                score: "100",
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score/1')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('scoreId, workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the score is invalid', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "abc",
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score/1')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('scoreId, workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the score has a invalid timestamp format', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "00:10:00:12",
                rx: 1,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score/1')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('scoreId, workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the rx is invalid', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "100",
                rx: true,
                note: "Note ABC",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score/1')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('scoreId, workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the note is invalid', function(done) {
            let score = {
                workoutId: 1,
                score: "100",
                rx: 1,
                note: "$<>",
                datetime: "1234567890"
            };
            chai.request(server)
            .post('/score/1')
            .set('Authorization', token)
            .send(score)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('scoreId, workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the datetime is invalid', function(done) {
            let invalidScore = {
                workoutId: 1,
                score: "100",
                rx: 1,
                note: "Note ABC",
                datetime: "00:10:00"
            };
            chai.request(server)
            .post('/score/1')
            .set('Authorization', token)
            .send(invalidScore)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('scoreId, workoutId, score, note or datetime are invalid');
                done();
            });
        });
        it('it should return an error (401 Unauthorized) when the token is null', function(done) {
            chai.request(server)
            .post('/score/' + scoreId)
            .end(function(err, res) {
                expect(res).to.have.status(401);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('No token provided');
                done();
            });
        });
        it('it should return an error (401 Unauthorized) when the token is invalid', function(done) {
            let invalidToken = "2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25X";
            chai.request(server)
            .post('/score/1')
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
