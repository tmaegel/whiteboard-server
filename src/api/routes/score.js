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
    var token = req.headers.authorization;
    if (!token) {
        console.log("ERROR: GET /score :: No token provided");
        res.status(401).json({
            type: "ERROR",
            message: "No token provided"
        });
    } else {
        // Verfiy token
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                console.log("ERROR: GET /score :: Failed to authenticate token");
                res.status(401).json({
                    type: "ERROR",
                    message: "Failed to authenticate token"
                });
            } else {
                // open database
                var db = new sqlite3.Database(Server.database, (err) => {
                    if (err) {
                        console.log("ERROR: GET /score :: Connecting database.");
                        return console.error(err.message);
                    }
                });
                db.all("SELECT id, userId, workoutId, score, rx, datetime, note FROM table_workout_score WHERE userId = ? ORDER BY id", [decoded.sub], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    console.log("OK: GET /score");
                    res.status(200).end(JSON.stringify(rows));
                    // close database
                    db.close((err) => {
                        if (err) {
                            console.log("ERROR: GET /score :: Closing database");
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
    var token = req.headers.authorization;
    if (!token) {
        console.log("ERROR: GET /score/:scoreId :: No token provided");
        res.status(401).json({
            type: "ERROR",
            message: "No token provided"
        });
    } else {
        // Verfiy token
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                console.log("ERROR: GET /score/:scoreId :: Failed to authenticate token");
                res.status(401).json({
                    type: "ERROR",
                    message: "Failed to authenticate token"
                });
            } else {
                if(id === null || id === undefined || !utils.numRegex(id)) {
                    console.log("ERROR: /score/:scoreId :: scoreId is invalid");
                    res.status(400).json({
                        type: "ERROR",
                        message: "scoreId is invalid"
                    });
                } else {
                    console.log("INFO: GET /score/:scoreId :: scoreId is " + id);
                    // open database
                    var db = new sqlite3.Database(Server.database, (err) => {
                        if (err) {
                            console.log("ERROR: GET /score/:scoreId :: Connecting database.");
                            return console.error(err.message);
                        }
                    });
                    db.get("SELECT id, userId, workoutId, score, rx, datetime, note FROM table_workout_score WHERE id = ? AND userId = ?", [id, decoded.sub], (err, row) => {
                        if (err) {
                            return console.error(err.message);
                        }
                        if(row != null) {
                            console.log("OK: GET /score/:scoreId");
                            res.status(200).end(JSON.stringify(row));
                        } else {
                            console.log("OK: GET /score/:scoreId :: No score found with the id " + id);
                            res.sendStatus(204);
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
    var rx = req.body.rx;
    var note = utils.stripString(req.body.note);
    var datetime = req.body.datetime;
    var token = req.headers.authorization;
    if (!token) {
        console.log("ERROR: POST /score :: No token provided");
        res.status(401).json({
            type: "ERROR",
            message: "No token provided"
        });
    } else {
        // Verfiy token
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                console.log("ERROR: POST /score :: Failed to authenticate token");
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
                let valid = (workoutId === null || workoutId === undefined || !utils.numRegex(workoutId) ||
                            note === null || note === undefined || !utils.simpleRegex(note) ||
                            rx === null || rx === undefined || (rx != 1 && rx != 0) || !utils.numRegex(rx) ||
                            datetime === null || datetime === undefined || utils.empty(datetime) || !utils.numRegex(datetime) ||
                            score === null || score === undefined || utils.empty(score) || (!utils.numRegex(score) && !utils.timestampRegex(score)));
                if(valid) {
                    console.log("ERROR: POST /score :: workoutId, score, note or datetime are invalid");
                    res.status(400).json({
                        type: "ERROR",
                        message: "workoutId, score, note or datetime are invalid"
                    });
                } else {
                    // open database
                    var db = new sqlite3.Database(Server.database, (err) => {
                        if (err) {
                            console.log("ERROR: POST /score :: Connecting database.");
                            return console.error(err.message);
                        }
                    });
                    // insert row
                    db.run("INSERT INTO table_workout_score(userId, workoutId, score, rx, datetime, note) VALUES (?, ?, ?, ?, ?, ?)", [decoded.sub, workoutId, score, rx, datetime, note], function(err) {
                        if (err) {
                            return console.log(err.message);
                        }
                        db.get("SELECT last_insert_rowid() from table_workout_score LIMIT 1", [], (err, row) => {
                            if (err) {
                                return console.error(err.message);
                            }
                            if(row != null) {
                                let id = row["last_insert_rowid()"];
                                console.log("INFO: POST /score :: Inserting score with id " + id);
                                db.get("SELECT id, userId, workoutId, score, rx, datetime, note FROM table_workout_score WHERE id = ? AND (userId = 1 OR userId = ?)", [id, decoded.sub], (err, row) => {
                                    if (err) {
                                        return console.error(err.message);
                                    }
                                    if(row != null) {
                                        console.log("OK: POST /score :: Inserted score with id " + id);
                                        res.status(201).end(JSON.stringify(row));
                                    } else {
                                        console.log("ERROR: POST /score :: No score found with the id " + id);
                                        res.status(500).json({
                                            type: "ERROR",
                                            message: "No score found with the id " + id
                                        });
                                    }
                                });
                            }
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
 * @return 404 Not Found
 */
router.post("/:scoreId", (req, res, next) => {
    var id = req.params.scoreId;
    var workoutId = req.body.workoutId;
    var score = utils.stripString(req.body.score);
    var rx = req.body.rx;
    var note = utils.stripString(req.body.note);
    var datetime = req.body.datetime;
    var token = req.headers.authorization;
    if (!token) {
        console.log("ERROR: POST /score/:scoreId :: No token provided");
        res.status(401).json({
            type: "ERROR",
            message: "No token provided"
        });
    } else {
        // Verfiy token
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                console.log("ERROR: POST /score/:scoreId :: Failed to authenticate token");
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
                let valid = (id === null || id === undefined || !utils.numRegex(id) ||
                            workoutId === null || workoutId === undefined || !utils.numRegex(workoutId) ||
                            note === null || note === undefined || !utils.simpleRegex(note) ||
                            rx === null || rx === undefined || (rx != 1 && rx != 0) || !utils.numRegex(rx) ||
                            datetime === null || datetime === undefined || utils.empty(datetime) || !utils.numRegex(datetime) ||
                            score === null || score === undefined || utils.empty(score) || (!utils.numRegex(score) && !utils.timestampRegex(score)));
                if(valid) {
                    console.log("ERROR: POST /score/:scoreId :: scoreId, workoutId, score, note or datetime are invalid");
                    res.status(400).json({
                        type: "ERROR",
                        message: "scoreId, workoutId, score, note or datetime are invalid"
                    });
                } else {
                    console.log("INFO: POST /score/:scoreId :: Updating score with id " + id);
                    // open database
                    var db = new sqlite3.Database(Server.database, (err) => {
                        if (err) {
                            console.log("ERROR: POST /score/:scoreId :: Connecting database.");
                            return console.error(err.message);
                        }
                    });
                    // insert row
                    db.run("UPDATE table_workout_score SET workoutId = ?, score = ?, rx = ?, datetime = ?, note = ? WHERE id = ? and userId = ?", [workoutId, score, rx, datetime, note, id, decoded.sub], function(err, row) {
                        if (err) {
                            return console.log(err.message);
                        }
                        if(this.changes >  0) {
                            console.log("OK: POST /score/:scoreId :: Updated score with id " + id);
                            res.status(200).json({
                                id: parseInt(id),
                                userId: decoded.sub,
                                workoutId: parseInt(workoutId),
                                score: score,
                                rx: rx,
                                note: note,
                                datetime: parseInt(datetime)
                            });
                        } else {
                            console.log("ERROR: POST /score/:scoreId :: No score found with the id " + id);
                            res.status(404).json({
                                type: "ERROR",
                                message: "No score found with the id"
                            });
                        }
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
