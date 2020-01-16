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
    describe('#GET /workout', function() {
        it('it should return all the workouts', function(done) {
            chai.request(server)
            .get('/workout')
            .set('Authorization', token)
            .end(function(err, res) {
                let parsedRes = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(parsedRes[0]).to.have.property('id');
                expect(parsedRes[0]).to.have.property('userId');
                expect(parsedRes[0]).to.have.property('name');
                expect(parsedRes[0]).to.have.property('description');
                expect(parsedRes[1]).to.have.property('id');
                expect(parsedRes[1]).to.have.property('userId');
                expect(parsedRes[1]).to.have.property('name');
                expect(parsedRes[1]).to.have.property('description');
                done();
            });
        });
        it('it should return an error (401 Unauthorized) when the token is null', function(done) {
            chai.request(server)
            .get('/workout')
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
    describe('#GET /workout/:workoutId', function() {
        it('it should return the workout with id', function(done) {
            chai.request(server)
            .get('/workout/1')
            .set('Authorization', token)
            .end(function(err, res) {
                let parsedRes = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(parsedRes).to.have.property('id').eql(1);
                expect(parsedRes).to.have.property('userId');
                expect(parsedRes).to.have.property('name');
                expect(parsedRes).to.have.property('description');
                done();
            });
        });
        it('it should return the status (204 No Content) when no workout was found with id', function(done) {
            chai.request(server)
            .get('/workout/9999')
            .set('Authorization', token)
            .end(function(err, res) {
                expect(res).to.have.status(204);
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the id is invalid', function(done) {
            chai.request(server)
            .get('/workout/a')
            .set('Authorization', token)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('workoutId is invalid');
                done();
            });
        });
        it('it should return an error (401 Unauthorized) when the token is null', function(done) {
            chai.request(server)
            .get('/workout/1')
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
    describe('#GET /workout/score/:workoutId', function() {
        it('it should return the workout with id', function(done) {
            chai.request(server)
            .get('/workout/score/1')
            .set('Authorization', token)
            .end(function(err, res) {
                let parsedRes = JSON.parse(res.text);
                expect(res).to.have.status(200);
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
        it('it should return an error (400 Bad Request) when the id is invalid', function(done) {
            chai.request(server)
            .get('/workout/score/a')
            .set('Authorization', token)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                res.body.should.have.property('type').eql('ERROR');
                res.body.should.have.property('message').eql('workoutId is invalid');
                done();
            });
        });
        it('it should return an error (401 Unauthorized) when the token is null', function(done) {
            chai.request(server)
            .get('/workout/score/1')
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
    describe('#POST /workout', function() {
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
                let parsedRes = JSON.parse(res.text);
                expect(res).to.have.status(201);
                expect(parsedRes).to.have.property('id');
                expect(parsedRes).to.have.property('userId');
                expect(parsedRes).to.have.property('name').eql('Name A');
                expect(parsedRes).to.have.property('description').eql('Description A');
                expect(parsedRes).to.have.property('datetime').eql(1234567890);
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the name is undefined/null', function(done) {
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
                res.body.should.have.property('message').eql('name, description or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the description is undefined/null', function(done) {
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
                res.body.should.have.property('message').eql('name, description or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the datetime is undefined/null', function(done) {
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
                res.body.should.have.property('message').eql('name, description or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the name is empty', function(done) {
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
                res.body.should.have.property('message').eql('name, description or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the description is empty', function(done) {
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
                res.body.should.have.property('message').eql('name, description or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the datetime is empty', function(done) {
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
                res.body.should.have.property('message').eql('name, description or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the name is invalid', function(done) {
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
                res.body.should.have.property('message').eql('name, description or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the description is invalid', function(done) {
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
                res.body.should.have.property('message').eql('name, description or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the datetime is invalid', function(done) {
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
                res.body.should.have.property('message').eql('name, description or datetime are invalid');
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
    describe('#POST /workout/:workoutId', function() {
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
                let parsedRes = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(parsedRes).to.have.property('id').eql(workoutId);
                expect(parsedRes).to.have.property('userId').eql(userId);
                expect(parsedRes).to.have.property('name').eql('Name XYZ');
                expect(parsedRes).to.have.property('description').eql('Description XYZ');
                expect(parsedRes).to.have.property('datetime').eql(1234567890);
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the name is undefined/null', function(done) {
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
                res.body.should.have.property('message').eql('id, name, description or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the description is undefined/null', function(done) {
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
                res.body.should.have.property('message').eql('id, name, description or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the datetime is undefined/null', function(done) {
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
                res.body.should.have.property('message').eql('id, name, description or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the name is empty', function(done) {
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
                res.body.should.have.property('message').eql('id, name, description or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the description is empty', function(done) {
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
                res.body.should.have.property('message').eql('id, name, description or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the datetime is empty', function(done) {
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
                res.body.should.have.property('message').eql('id, name, description or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the id is invalid', function(done) {
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
                res.body.should.have.property('message').eql('id, name, description or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when no workout was found with id', function(done) {
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
                expect(res).to.have.status(204);
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the name is invalid', function(done) {
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
                res.body.should.have.property('message').eql('id, name, description or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the description is invalid', function(done) {
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
                res.body.should.have.property('message').eql('id, name, description or datetime are invalid');
                done();
            });
        });
        it('it should return an error (400 Bad Request) when the datetime is invalid', function(done) {
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
                res.body.should.have.property('message').eql('id, name, description or datetime are invalid');
                done();
            });
        });
        it('it should return an error (401 Unauthorized) when the token is null', function(done) {
            chai.request(server)
            .post('/workout/1')
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
