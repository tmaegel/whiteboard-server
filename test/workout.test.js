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

describe('workout.js', () => {
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
     * Testing #GET /workout
     */
    describe('#GET /workout', function() {
        /**
         * Positive tests #GET /workout
         */
        describe('#GET /workout (positive tests)', function() {
            it('it should return all the workouts', function(done) {
                chai.request(server)
                .get('/workout')
                .set('Authorization', token)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    let parsedRes = JSON.parse(res.text);
                    expect(parsedRes[0]).to.have.property('id');
                    expect(parsedRes[0]).to.have.property('userId');
                    expect(parsedRes[0]).to.have.property('name');
                    expect(parsedRes[0]).to.have.property('description');
                    expect(parsedRes[0]).to.have.property('datetime');
                    expect(parsedRes[1]).to.have.property('id');
                    expect(parsedRes[1]).to.have.property('userId');
                    expect(parsedRes[1]).to.have.property('name');
                    expect(parsedRes[1]).to.have.property('description');
                    expect(parsedRes[1]).to.have.property('datetime');
                    done();
                });
            });
        });
        /**
         * Negative tests #GET /workout
         */
        describe('#GET /workout (negative tests)', function() {
            it('it should return an error (401 Unauthorized) if the token is null/undefined', function(done) {
                chai.request(server)
                .get('/workout')
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
                .get('/workout')
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
     * Testing #GET /workout/:workoutId
     */
    describe('#GET /workout/:workoutId', function() {
        /**
         * Positive tests #GET /workout/:workoutId
         */
        describe('#GET /workout/:workoutId (positive tests)', function() {
            it('it should return the workout with id', function(done) {
                chai.request(server)
                .get('/workout/1')
                .set('Authorization', token)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    let parsedRes = JSON.parse(res.text);
                    expect(parsedRes).to.have.property('id').eql(1);
                    expect(parsedRes).to.have.property('userId');
                    expect(parsedRes).to.have.property('name');
                    expect(parsedRes).to.have.property('description');
                    done();
                });
            });
            it('it should return no workout but the status (204 No Content) if no workout was found with id', function(done) {
                chai.request(server)
                .get('/workout/9999')
                .set('Authorization', token)
                .end(function(err, res) {
                    expect(res).to.have.status(204);
                    done();
                });
            });
        });
        /**
         * Negative tests #GET /workout/:workoutId
         */
        describe('#GET /workout/:workoutId (negative tests)', function() {
            it('it should return an error (400 Bad Request) if the id is invalid', function(done) {
                chai.request(server)
                .get('/workout/a')
                .set('Authorization', token)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout id is invalid');
                    done();
                });
            });
            it('it should return an error (401 Unauthorized) if the token is null/undefined', function(done) {
                chai.request(server)
                .get('/workout/1')
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
                .get('/workout/1')
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
     * Testing #GET /workout/score/:workoutId
     */
    describe('#GET /workout/score/:workoutId', function() {
        /**
         * Positive tests #GET /workout/score/:workoutId
         */
        describe('#GET /workout/score/:workoutId (positive tests)', function() {
            it('it should return the scores of workout with id', function(done) {
                chai.request(server)
                .get('/workout/score/1')
                .set('Authorization', token)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    let parsedRes = JSON.parse(res.text);
                    expect(parsedRes[0]).to.have.property('id');
                    expect(parsedRes[0]).to.have.property('workoutId').eql(1);
                    expect(parsedRes[0]).to.have.property('score');
                    expect(parsedRes[0]).to.have.property('datetime');
                    expect(parsedRes[1]).to.have.property('id');
                    expect(parsedRes[1]).to.have.property('workoutId').eql(1);
                    expect(parsedRes[1]).to.have.property('score');
                    expect(parsedRes[1]).to.have.property('datetime');
                    done();
                });
            });
        });
        /**
         * Negative tests #GET /workout/score/:workoutId
         */
        describe('#GET /workout/score/:workoutId (negative tests)', function() {
            it('it should return an error (400 Bad Request) if the id is invalid', function(done) {
                chai.request(server)
                .get('/workout/score/a')
                .set('Authorization', token)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout id is invalid');
                    done();
                });
            });
            it('it should return an error (401 Unauthorized) if the token is null/undefined', function(done) {
                chai.request(server)
                .get('/workout/score/1')
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
                .get('/workout/score/1')
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
     * Testing #POST /workout
     */
    describe('#POST /workout', function() {
        /**
         * Positive tests #POST /workout
         */
        describe('#POST /workout (positive tests)', function() {
            it('it should save the workout', function(done) {
                let workout = {
                    name: "Name A",
                    description: "Description A",
                    datetime: "1234567890"
                };
                chai.request(server)
                .post('/workout')
                .set('Authorization', token)
                .send(workout)
                .end(function(err, res) {
                    expect(res).to.have.status(201);
                    let parsedRes = JSON.parse(res.text);
                    expect(parsedRes).to.have.property('id');
                    expect(parsedRes).to.have.property('userId');
                    expect(parsedRes).to.have.property('name').eql('Name A');
                    expect(parsedRes).to.have.property('description').eql('Description A');
                    expect(parsedRes).to.have.property('datetime').eql(1234567890);
                    done();
                });
            });
        });
        /**
         * Negative tests #POST /workout
         */
        describe('#POST /workout (negative tests)', function() {
            it('it should return an error (400 Bad Request) if the name is null/undefined', function(done) {
                let invalidWorkout = {
                    description: "Description A",
                    datetime: "1234567890"
                };
                chai.request(server)
                .post('/workout')
                .set('Authorization', token)
                .send(invalidWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the description is null/undefined', function(done) {
                let invalidWorkout = {
                    name: "Name A",
                    datetime: "1234567890"
                };
                chai.request(server)
                .post('/workout')
                .set('Authorization', token)
                .send(invalidWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the datetime is null/undefined', function(done) {
                let invalidWorkout = {
                    name: "Name A",
                    description: "Description A"
                };
                chai.request(server)
                .post('/workout')
                .set('Authorization', token)
                .send(invalidWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the name is empty', function(done) {
                let invalidWorkout = {
                    name: "",
                    description: "Description A",
                    datetime: "1234567890"
                };
                chai.request(server)
                .post('/workout')
                .set('Authorization', token)
                .send(invalidWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the description is empty', function(done) {
                let invalidWorkout = {
                    name: "Name A",
                    description: "",
                    datetime: "1234567890"
                };
                chai.request(server)
                .post('/workout')
                .set('Authorization', token)
                .send(invalidWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the datetime is empty', function(done) {
                let invalidWorkout = {
                    name: "Name A",
                    description: "Description A",
                    datetime: ""
                };
                chai.request(server)
                .post('/workout')
                .set('Authorization', token)
                .send(invalidWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the name is invalid', function(done) {
                let invalidWorkout = {
                    name: "Name A$",
                    description: "Description A",
                    datetime: "1234567890"
                };
                chai.request(server)
                .post('/workout')
                .set('Authorization', token)
                .send(invalidWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the description is invalid', function(done) {
                let invalidWorkout = {
                    name: "Name A",
                    description: "Description A$",
                    datetime: "1234567890"
                };
                chai.request(server)
                .post('/workout')
                .set('Authorization', token)
                .send(invalidWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the datetime is invalid', function(done) {
                let invalidWorkout = {
                    name: "Name A",
                    description: "Description A",
                    datetime: "abc"
                };
                chai.request(server)
                .post('/workout')
                .set('Authorization', token)
                .send(invalidWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (401 Unauthorized) if the token is null/undefined', function(done) {
                chai.request(server)
                .post('/workout')
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
                .post('/workout')
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
     * Testing #POST /workout/:workoutId
     */
    describe('#POST /workout/:workoutId', function() {
        /**
         * Positive tests #POST /workout/:workoutId
         */
        describe('#POST /workout/:workoutId (positive tests)', function() {
            let workoutId, userId;
            before(function(done) { // runs before all tests in this block
                // Inserted real workout before updating
                let workout = {
                    name: "Name ABC",
                    description: "Description ABC",
                    datetime: "9876543210"
                };
                chai.request(server)
                .post('/workout')
                .set('Authorization', token)
                .send(workout)
                .end(function(err, res) {
                    workoutId = parseInt(JSON.parse(res.text).id);
                    userId = parseInt(JSON.parse(res.text).userId);
                    done();
                });
            });
            it('it should update the workout', function(done) {
                let updateWorkout = {
                    name: "Name XYZ",
                    description: "Description XYZ",
                    datetime: "1234567890"
                };
                chai.request(server)
                .post('/workout/' + workoutId) // update the inserted workout
                .set('Authorization', token)
                .send(updateWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    let parsedRes = JSON.parse(res.text);
                    expect(parsedRes).to.have.property('id').eql(workoutId);
                    expect(parsedRes).to.have.property('userId').eql(userId);
                    expect(parsedRes).to.have.property('name').eql('Name XYZ');
                    expect(parsedRes).to.have.property('description').eql('Description XYZ');
                    expect(parsedRes).to.have.property('datetime').eql(1234567890);
                    done();
                });
            });
            it('it should ignore the userId and update the workout', function(done) {
                let updateWorkout = {
                    userId: 99,
                    name: "Name XYZ",
                    description: "Description XYZ",
                    datetime: "1234567890"
                };
                chai.request(server)
                .post('/workout/' + workoutId) // update the inserted workout
                .set('Authorization', token)
                .send(updateWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    let parsedRes = JSON.parse(res.text);
                    expect(parsedRes).to.have.property('id').eql(workoutId);
                    expect(parsedRes).to.have.property('userId').eql(userId);
                    expect(parsedRes).to.have.property('name').eql('Name XYZ');
                    expect(parsedRes).to.have.property('description').eql('Description XYZ');
                    expect(parsedRes).to.have.property('datetime').eql(1234567890);
                    done();
                });
            });
        });
        /**
         * Negative tests #POST /workout/:workoutId
         */
        describe('#POST /workout/:workoutId (negative tests)', function() {
            it('it should return an error (400 Bad Request) if the name is null/undefined', function(done) {
                let invalidWorkout = {
                    description: "Description A",
                    datetime: "1234567890"
                };
                chai.request(server)
                .post('/workout/1')
                .set('Authorization', token)
                .send(invalidWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout id, name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the description is null/undefined', function(done) {
                let invalidWorkout = {
                    name: "Name A",
                    datetime: "1234567890"
                };
                chai.request(server)
                .post('/workout/1')
                .set('Authorization', token)
                .send(invalidWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout id, name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the datetime is null/undefined', function(done) {
                let invalidWorkout = {
                    name: "Name A",
                    description: "Description A"
                };
                chai.request(server)
                .post('/workout/1')
                .set('Authorization', token)
                .send(invalidWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout id, name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the name is empty', function(done) {
                let invalidWorkout = {
                    name: "",
                    description: "Description A",
                    datetime: "1234567890"
                };
                chai.request(server)
                .post('/workout/1')
                .set('Authorization', token)
                .send(invalidWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout id, name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the description is empty', function(done) {
                let invalidWorkout = {
                    name: "Name A",
                    description: "",
                    datetime: "1234567890"
                };
                chai.request(server)
                .post('/workout/1')
                .set('Authorization', token)
                .send(invalidWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout id, name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the datetime is empty', function(done) {
                let invalidWorkout = {
                    name: "Name A",
                    description: "Description A",
                    datetime: ""
                };
                chai.request(server)
                .post('/workout/1')
                .set('Authorization', token)
                .send(invalidWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout id, name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the id is invalid', function(done) {
                let valid = {
                    name: "Name A",
                    description: "Description A",
                    datetime: "1234567890"
                };
                chai.request(server)
                .post('/workout/a')
                .set('Authorization', token)
                .send(valid)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout id, name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (404 Not Found) if no workout was found with id', function(done) {
                let valid = {
                    name: "Name A",
                    description: "Description A",
                    datetime: "1234567890"
                };
                chai.request(server)
                .post('/workout/999999')
                .set('Authorization', token)
                .send(valid)
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('No workout found with the id');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the name is invalid', function(done) {
                let invalidWorkout = {
                    name: "Name A$",
                    description: "Description A",
                    datetime: "1234567890"
                };
                chai.request(server)
                .post('/workout/1')
                .set('Authorization', token)
                .send(invalidWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout id, name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the description is invalid', function(done) {
                let invalidWorkout = {
                    name: "Name A",
                    description: "Description A$",
                    datetime: "1234567890"
                };
                chai.request(server)
                .post('/workout/1')
                .set('Authorization', token)
                .send(invalidWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout id, name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (400 Bad Request) if the datetime is invalid', function(done) {
                let invalidWorkout = {
                    name: "Name A",
                    description: "Description A",
                    datetime: "abc"
                };
                chai.request(server)
                .post('/workout/1')
                .set('Authorization', token)
                .send(invalidWorkout)
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    res.body.should.have.property('type').eql('ERROR');
                    res.body.should.have.property('message').eql('workout id, name, description or datetime are invalid');
                    done();
                });
            });
            it('it should return an error (401 Unauthorized) if the token is null/undefined', function(done) {
                chai.request(server)
                .post('/workout/1')
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
                .post('/workout/1')
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
