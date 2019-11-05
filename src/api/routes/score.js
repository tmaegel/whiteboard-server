const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const fs = require('fs');
const bodyParser = require("body-parser");
const router = express.Router();

router.use(bodyParser.json());

// jwt
var jwt = require('jsonwebtoken');

// config
var config = require("../../config.json");

// utils
var utils = require("../../utils");

// Exporting objects
var Database = require("../../sqlite");
var Server = require('../../server');

/**
 * GET requests
 * Get all workouts scores
 * @return 200 OK
 * @return 401 Unauthorized
 */
router.get("/", (req, res, next) => {
    console.log("Getting all workout scores");

    var token = req.headers.authorization;
    if (!token) {
        res.status(401).json({
            type: "ERROR",
            message: "No token provided"
        });
    } else {
        // Verfiy token
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.status(401).json({
                    type: "ERROR",
                    message: "Failed to authenticate token"
                });
            } else {
                // open database
                var db = new sqlite3.Database(Server.database, (err) => {
                    if (err) {
                        console.log("ERROR: GET /score/ :: Connecting database.");
                        return console.error(err.message);
                    }
                });

                db.all("SELECT id, workout_id, score, datetime, note FROM table_workout_score ORDER BY id", [], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    res.status(200).end(JSON.stringify(rows));

                    // close database
                    db.close((err) => {
                        if (err) {
                            console.log("ERROR: GET /score/ :: Closing database");
                            return console.error(err.message);
                        }
                    });
                });
            }
        });
    }
});

/**
 * GET requests
 * Get workout score with ID
 * @return 200 OK
 * @return 204 No Content
 * @return 400 Bad Request
 * @return 401 Unauthorized
 */
router.get("/:scoreId", (req, res, next) => {
    const id = req.params.scoreId;
    console.log("Getting workout score with id " + id);
    
    var token = req.headers.authorization;
    if (!token) {
        res.status(401).json({
            type: "ERROR",
            message: "No token provided"
        });
    } else {
        // Verfiy token
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.status(401).json({
                    type: "ERROR",
                    message: "Failed to authenticate token"
                });
            } else {
                if(id == null || !utils.numRegex(id)) {
                    console.log("ERROR: /score/:scoreId :: scoreId is invalid");
                    res.status(400).json({
                        type: "ERROR",
                        message: "scoreId is invalid"
                    }); 
                } else {
                    // open database
                    var db = new sqlite3.Database(Server.database, (err) => {
                        if (err) {
                            console.log("ERROR: GET /score/:scoreId :: Connecting database.");
                            return console.error(err.message);
                        }
                    });

                    db.get("SELECT id, score, datetime, note FROM table_workout_score WHERE id  = ?", [id], (err, row) => {
                        if (err) {
                            return console.error(err.message);
                        }
                        if(row != null) {
                            res.status(200).end(JSON.stringify(row));
                        } else {
                            console.log("No data set found with the id ${id}");
                            res.status(204).json({
                                type: "INFO",
                                message: "No workout score found"
                            });
                        }

                        // close database
                        db.close((err) => {
                            if (err) {
                                console.log("ERROR: GET /score/:scoreId :: Closing database");
                                return console.error(err.message);
                            }
                        });
                    });
                }
            }
        });
    }
});

/**
 * POST requests
 * SAVE workout score
 * @return 201 Created
 * @return 400 Bad Request
 * @return 401 Unauthorized
 */
router.post("/", (req, res, next) => {
    var workoutId = req.body.workoutId;
    var score = utils.stripString(req.body.score);
    var note = utils.stripString(req.body.note);
    var datetime = req.body.datetime;
    
    console.log("Saving workout score");

    var token = req.headers.authorization;
    if (!token) {
        res.status(401).json({
            type: "ERROR",
            message: "No token provided"
        });
    } else {
        // Verfiy token
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.status(401).json({
                    type: "ERROR",
                    message: "Failed to authenticate token"
                });
            } else {
                /**
                 * @todo: Security checks!!!
                 * @todo Remove obsolete spaces and line breaks
                 *
                 * @todo Remove all leading/ending space from name
                 *       Remove all new lines (\n) from name
                 * @todo Remove all leading/ending space from description
                 *       Remove alle multiple new lines and spaces from description
                 */
                let valid = (workoutId == null || !utils.numRegex(workoutId) ||
                            note == null || !utils.simpleRegex(note) || 
                            datetime == null || utils.empty(datetime) || !utils.numRegex(datetime) ||
                            score == null || utils.empty(score) || (!utils.numRegex(score) && !utils.timestampRegex(score)))
                if(valid) {
                    console.log("ERROR: POST /score/ :: workoutId, score, note or datetime are invalid");
                    res.status(400).json({
                        type: "ERROR",
                        message: "workoutId, score, note or datetime are invalid"
                    });
                } else {
                    // open database
                    var db = new sqlite3.Database(Server.database, (err) => {
                        if (err) {
                            console.log("ERROR: POST /score/ :: Connecting database.");
                            return console.error(err.message);
                        }
                    });

                    // insert row
                    db.run("INSERT INTO table_workout_score(workout_id, score, datetime, note) VALUES (?, ?, ?, ?)", [workoutId, score, datetime, note], function(err) {
                        if (err) {
                            return console.log(err.message);
                        }
                        console.log("Inserted new workout score");
                        res.status(201).json({
                            type: "SUCCESS",
                            message: "Workout score was created",
                            result: req.body
                        });
                    });

                    // close database
                    db.close((err) => {
                        if (err) {
                            console.log("ERROR: POST /score/ :: Closing database");
                            return console.error(err.message);
                        }
                    });
                }
            }
        });
    }
});

/**
 * PATCH requests
 * Patch workout score with ID
 * @return 200 OK
 * @return 400 Bad Request
 * @return 401 Unauthorized
 */
router.post("/:scoreId", (req, res, next) => {
    var id = req.params.scoreId;
    var workoutId = req.body.workoutId;
    var score = utils.stripString(req.body.score);
    var note = utils.stripString(req.body.note);
    var datetime = req.body.datetime;
    
    console.log("Updating workout score");

    var token = req.headers.authorization;
    if (!token) {
        res.status(401).json({
            type: "ERROR",
            message: "No token provided"
        });
    } else {
        // Verfiy token
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.status(401).json({
                    type: "ERROR",
                    message: "Failed to authenticate token"
                });
            } else {
                /**
                 * @todo: Security checks!!!
                 * @todo Remove obsolete spaces and line breaks
                 *
                 * @todo Remove all leading/ending space from name
                 *       Remove all new lines (\n) from name
                 * @todo Remove all leading/ending space from description
                 *       Remove alle multiple new lines and spaces from description
                 */
                let valid = (workoutId == null || !utils.numRegex(workoutId) ||
                            note == null || !utils.simpleRegex(note) || 
                            datetime == null || utils.empty(datetime) || !utils.numRegex(datetime) ||
                            score == null || (!utils.numRegex(score) && !utils.timestampRegex(score)))
                if(valid) {
                    console.log("ERROR: POST /score/:scoreId :: scoreId, workoutId, score, note or datetime are invalid");
                    res.status(400).json({
                        type: "ERROR",
                        message: "scoreId, workoutId, score, note or datetime are invalid"
                    });
                } else {
                    // open database
                    var db = new sqlite3.Database(Server.database, (err) => {
                        if (err) {
                            console.log("ERROR: POST /score/:scoreId :: Connecting database.");
                            return console.error(err.message);
                        }
                    });

                    // insert row
                    db.run("UPDATE table_workout_score SET score=?, datetime=?, note=? WHERE id=?", [score, datetime, note, id], function(err) {
                        if (err) {
                            return console.log(err.message);
                        }
                        console.log("Updated workout score with id " + id);
                        res.status(200).json({
                            type: "SUCCESS",
                            message: "Workout score was updated",
                            result: req.body
                        });
                    });

                    // close database
                    db.close((err) => {
                        if (err) {
                            console.log("ERROR: POST /score/:scoreId :: Closing database");
                            return console.error(err.message);
                        }
                    });
                }
            }
        });
    }
});

module.exports = router;
