const express = require("express");
const fs = require('fs');
const bodyParser = require("body-parser");
const router = express.Router();

router.use(bodyParser.json());

// Importing objects
const utils = require("../../helpers/utils.helper.js");
const database = require("../../models/sqlite.model.js");
const user = require("../../models/user.model.js");
const score = require("../../models/score.model.js");

/**
 * GET requests
 * Get all workouts scores
 * @return 200 OK
 * @return 401 Unauthorized
 * @return 500 Internal Server Error
 */
router.get("/", (req, res, next) => {
    const token = req.headers.authorization;
    user.validate(token).then(
        decoded => {
            score.getScores(decoded.sub).then(
                results => {
                    console.log("OK: GET /score");
                    res.status(200).end(JSON.stringify(results));
                },
                error => {
                    console.log("ERROR: GET /score ::", error.message);
                    res.status(500).json({
                        type: "ERROR",
                        message: "Internal Server Error"
                    });
                },
            );
        },
        error => {
            // No token provided
            // Failed to authenticate token
            console.log("ERROR: GET /score ::", error.message);
            res.status(401).json({type: "ERROR", message: error.message});
        },
    ).catch((error) => {
        console.log("ERROR: GET /score :: An unexpected error has occurred ::", error.message);
    });
});

/**
 * GET requests
 * Get workout score with ID
 * @return 200 OK
 * @return 204 No Content
 * @return 400 Bad Request
 * @return 401 Unauthorized
 * @return 500 Internal Server Error
 */
router.get("/:scoreId", (req, res, next) => {
    const token = req.headers.authorization;
    const scoreId = req.params.scoreId;
    user.validate(token).then(
        decoded => {
            if(scoreId === undefined || scoreId === null || !utils.numRegex(scoreId)) {
                console.log("ERROR: GET /score/:scoreId :: scoreId is invalid");
                res.status(400).json({
                    type: "ERROR",
                    message: "scoreId is invalid"
                });
            } else {
                console.log("INFO: GET /score/:scoreId :: scoreId is " + scoreId);
                score.getScoreById(decoded.sub, scoreId).then(
                    result => {
                        if(result != null) {
                            console.log("OK: GET /score/:scoreId");
                            res.status(200).end(JSON.stringify(result));
                        } else {
                            console.log("OK: GET /score/:scoreId :: No score found with the id " + scoreId);
                            res.sendStatus(204);
                        }
                    },
                    error => {
                        console.log("ERROR: GET /score/:scoreId ::", error.message);
                        res.status(500).json({
                            type: "ERROR",
                            message: "Internal Server Error"
                        });
                    },
                );
            }
        },
        error => {
            // No token provided
            // Failed to authenticate token
            console.log("ERROR: GET /score/:scoreId ::", error.message);
            res.status(401).json({type: "ERROR", message: error.message});
        },
    ).catch((error) => {
        console.log("ERROR: GET /score/:scoreId :: An unexpected error has occurred ::", error.message);
    });
});

/**
 * POST requests
 * SAVE workout score
 * @return 201 Created
 * @return 400 Bad Request
 * @return 401 Unauthorized
 * @return 500 Internal Server Error
 */
router.post("/", (req, res, next) => {
    const token = req.headers.authorization;
    const workoutId = req.body.workoutId;
    const scoreValue = utils.stripString(req.body.score);
    const rx = req.body.rx;
    const note = utils.stripString(req.body.note);
    const datetime = req.body.datetime;
    user.validate(token).then(
        decoded => {
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
                        scoreValue === null || scoreValue === undefined || utils.empty(scoreValue) || (!utils.numRegex(scoreValue) && !utils.floatRegex(scoreValue) && !utils.timestampRegex(scoreValue)));
            if(valid) {
                console.log("ERROR: POST /score :: workoutId, score, note, rx or datetime are invalid");
                res.status(400).json({
                    type: "ERROR",
                    message: "workoutId, score, note, rx or datetime are invalid"
                });
            } else {
                console.log("INFO: POST /score :: Inserting score");
                score.insertScore({ userId: decoded.sub, workoutId: workoutId, score: scoreValue, rx: rx, datetime: datetime, note: note }).then(
                    insertedId => {
                        score.getScoreById(decoded.sub, insertedId).then(
                            result => {
                                if(result != null) {
                                    console.log("OK: POST /score :: Inserted score with id " + insertedId);
                                    res.status(201).end(JSON.stringify(result));
                                } else {
                                    console.log("ERROR: POST /score :: No inserted score found with the id " + insertedId);
                                    res.status(500).json({
                                        type: "ERROR",
                                        message: "No inserted score found with the id " + id
                                    });
                                }
                            },
                            error => {
                                console.log("ERROR: POST /score ::", error.message);
                                res.status(500).json({
                                    type: "ERROR",
                                    message: "Internal Server Error"
                                });
                            },
                        );
                    },
                    error => {
                        console.log("ERROR: POST /score ::", error.message);
                        res.status(500).json({
                            type: "ERROR",
                            message: "Internal Server Error"
                        });
                    },
                );
            }
        },
        error => {
            // No token provided
            // Failed to authenticate token
            console.log("ERROR: POST /score ::", error.message);
            res.status(401).json({type: "ERROR", message: error.message});
        },
    ).catch((error) => {
        console.log("ERROR: POST /score :: An unexpected error has occurred ::", error.message);
    });
});

/**
 * PATCH requests
 * Patch workout score with ID
 * @return 200 OK
 * @return 400 Bad Request
 * @return 401 Unauthorized
 * @return 404 Not Found
 * @return 500 Internal Server Error
 */
router.post("/:scoreId", (req, res, next) => {
    const token = req.headers.authorization;
    const scoreId = req.params.scoreId;
    const workoutId = req.body.workoutId;
    const scoreValue = utils.stripString(req.body.score);
    const rx = req.body.rx;
    const note = utils.stripString(req.body.note);
    const datetime = req.body.datetime;
    user.validate(token).then(
        decoded => {
            /**
             * @todo: Security checks!!!
             * @todo Remove obsolete spaces and line breaks
             *
             * @todo Remove all leading/ending space from name
             *       Remove all new lines (\n) from name
             * @todo Remove all leading/ending space from description
             *       Remove alle multiple new lines and spaces from description
             */
            let valid = (scoreId === null || scoreId === undefined || !utils.numRegex(scoreId) ||
                        workoutId === null || workoutId === undefined || !utils.numRegex(workoutId) ||
                        note === null || note === undefined || !utils.simpleRegex(note) ||
                        rx === null || rx === undefined || (rx != 1 && rx != 0) || !utils.numRegex(rx) ||
                        datetime === null || datetime === undefined || utils.empty(datetime) || !utils.numRegex(datetime) ||
                        scoreValue === null || scoreValue === undefined || utils.empty(scoreValue) || (!utils.numRegex(scoreValue) && !utils.floatRegex(scoreValue) && !utils.timestampRegex(scoreValue)));
            if(valid) {
                console.log("ERROR: POST /score/:scoreId :: scoreId, workoutId, score, note, rx or datetime are invalid");
                res.status(400).json({
                    type: "ERROR",
                    message: "scoreId, workoutId, score, note, rx or datetime are invalid"
                });
            } else {
                console.log("INFO: POST /score/:scoreId :: Updating score");
                score.updateScore({ id: scoreId, userId: decoded.sub, workoutId: workoutId, score: scoreValue, rx: rx, datetime: datetime, note: note }).then(
                    updatedId => {
                        console.log("OK: POST /score/:scoreId :: Updated score with id " + scoreId);
                        res.status(200).json({
                            id: parseInt(scoreId),
                            userId: decoded.sub,
                            workoutId: parseInt(workoutId),
                            score: scoreValue,
                            rx: rx,
                            note: note,
                            datetime: parseInt(datetime)
                        });
                    },
                    error => {
                        console.log("ERROR: POST /score/:scoreId ::", error.message);
                        res.status(404).json({
                            type: "ERROR",
                            message: error.message
                        });
                    },
                );
            }
        },
        error => {
            // No token provided
            // Failed to authenticate token
            console.log("ERROR: POST /score/:scoreId ::", error.message);
            res.status(401).json({type: "ERROR", message: error.message});
        },
    ).catch((error) => {
        console.log("ERROR: POST /score/:scoreId :: An unexpected error has occurred ::", error.message);
    });
});

module.exports = router;
