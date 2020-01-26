const express = require("express");
const fs = require('fs');
const bodyParser = require("body-parser");
const router = express.Router();

router.use(bodyParser.json());

// Importing objects
const utils = require("../../helpers/utils.helper.js");
const database = require("../../models/sqlite.model.js");
const user = require("../../models/user.model.js");
const workout = require("../../models/workout.model.js");

/**
 * REST
 */

/**
 * GET requests
 * Get all workouts
 * @return 200 OK
 * @return 401 Unauthorized
 * @return 500 Internal Server Error
 */
router.get("/", (req, res, next) => {
    const token = req.headers.authorization;
    user.validate(token).then(
        decoded => {
            workout.getWorkouts(decoded.sub).then(
                results => {
                    console.log("OK: GET /workout");
                    res.status(200).end(JSON.stringify(results));
                },
                error => {
                    console.log("ERROR: GET /workout ::", error.message);
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
            console.log("ERROR: GET /workout ::", error.message);
            res.status(401).json({type: "ERROR", message: error.message});
        },
    ).catch((error) => {
        console.log("ERROR: GET /workout :: An unexpected error has occurred ::", error.message);
    });
});

/**
 * GET requests
 * Get workout with ID
 * @return 200 OK
 * @return 204 No Content
 * @return 400 Bad Request
 * @return 401 Unauthorized
 */
router.get("/:workoutId", (req, res, next) => {
    const token = req.headers.authorization;
    const workoutId = req.params.workoutId;
    user.validate(token).then(
        decoded => {
            if(workoutId === undefined || workoutId === null || !utils.numRegex(workoutId)) {
                console.log("ERROR: GET /workout/:workoutId :: workoutId is invalid");
                res.status(400).json({
                    type: "ERROR",
                    message: "workoutId is invalid"
                });
            } else {
                console.log("INFO: GET /workout/:workoutId :: workoutId is " + workoutId);
                workout.getWorkoutById(decoded.sub, workoutId).then(
                    result => {
                        if(result != null) {
                            console.log("OK: GET /workout/:workoutId");
                            res.status(200).end(JSON.stringify(result));
                        } else {
                            console.log("OK: GET /workout/:workoutId :: No workout found with the id " + workoutId);
                            res.sendStatus(204);
                        }
                    },
                    error => {
                        console.log("ERROR: GET /workout/:workoutId ::", error.message);
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
            console.log("ERROR: GET /workout/:workoutId ::", error.message);
            res.status(401).json({type: "ERROR", message: error.message});
        },
    ).catch((error) => {
        console.log("ERROR: GET /workout/:workoutId :: An unexpected error has occurred ::", error.message);
    });
});

/**
 * GET requests
 * Get workout scores with workout ID
 * @return 200 OK
 * @return 400 Bad Request
 * @return 401 Unauthorized
 */
router.get("/score/:workoutId", (req, res, next) => {
    const token = req.headers.authorization;
    const workoutId = req.params.workoutId;
    user.validate(token).then(
        decoded => {
            if(workoutId === undefined || workoutId === null || !utils.numRegex(workoutId)) {
                console.log("ERROR: GET /workout/score/:workoutId :: workoutId is invalid");
                res.status(400).json({
                    type: "ERROR",
                    message: "workoutId is invalid"
                });
            } else {
                console.log("INFO: GET /workout/score/:workoutId :: workoutId is " + workoutId);
                workout.getWorkoutScoresById(decoded.sub, workoutId).then(
                    results => {
                        console.log("OK: GET /workout/score/:workoutId");
                        res.status(200).end(JSON.stringify(results));
                    },
                    error => {
                        console.log("ERROR: GET /workout/score/:workoutId ::", error.message);
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
            console.log("ERROR: GET /workout/score/:workoutId ::", error.message);
            res.status(401).json({type: "ERROR", message: error.message});
        },
    ).catch((error) => {
        console.log("ERROR: GET /workout/score/:workoutId :: An unexpected error has occurred ::", error.message);
    });
});

/**
 * POST requests
 * SAVE workout
 * @return 201 Created
 * @return 400 Bad Request
 * @return 401 Unauthorized
 * @return 500 Internal Server Error
 */
router.post("/", (req, res, next) => {
    const token = req.headers.authorization;
    const name = utils.stripString(req.body.name);
    const description = utils.stripString(req.body.description);
    const datetime = req.body.datetime;
    user.validate(token).then(
        decoded => {
            /**
             * @todo Remove obsolete spaces and line breaks
             *
             * @todo Remove all leading/ending space from name
             *       Remove all new lines (\n) from name
             * @todo Remove all leading/ending space from description
             *       Remove alle multiple new lines and spaces from description
             */
            let valid = (name === null || name === undefined || utils.empty(name) || !utils.simpleRegex(name) ||
                        description === null || description === undefined || utils.empty(description) || !utils.extendedRegex(description) ||
                        datetime === null || datetime === undefined || utils.empty(datetime) || !utils.numRegex(datetime))
            if(valid) {
                console.log("ERROR: POST /workout :: name, description or datetime are invalid");
                res.status(400).json({
                    type: "ERROR",
                    message: "name, description or datetime are invalid"
                });
            } else {
                console.log("INFO: POST /workout :: Inserting workout");
                workout.insertWorkout({ userId: decoded.sub, name: name, description: description, datetime: datetime }).then(
                    insertedId => {
                        workout.getWorkoutById(decoded.sub, insertedId).then(
                            result => {
                                if(result != null) {
                                    console.log("OK: POST /workout :: Inserted workout with id " + insertedId);
                                    res.status(201).end(JSON.stringify(result));
                                } else {
                                    console.log("ERROR: POST /workout :: No inserted workout found with the id " + insertedId);
                                    res.status(500).json({
                                        type: "ERROR",
                                        message: "No inserted workout found with the id " + id
                                    });
                                }
                            },
                            error => {
                                console.log("ERROR: POST /workout ::", error.message);
                                res.status(500).json({
                                    type: "ERROR",
                                    message: "Internal Server Error"
                                });
                            },
                        );
                    },
                    error => {
                        console.log("ERROR: POST /workout ::", error.message);
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
            console.log("ERROR: POST /workout ::", error.message);
            res.status(401).json({type: "ERROR", message: error.message});
        },
    ).catch((error) => {
        console.log("ERROR: POST /workout :: An unexpected error has occurred ::", error.message);
    });
});

/**
 * PATCH requests
 * Patch workout with ID
 * @return 200 OK
 * @return 400 Bad Request
 * @return 401 Unauthorized
 * @return 404 Not Found
 * @return 500 Internal Server Error
 */
router.post("/:workoutId", (req, res, next) => {
    const token = req.headers.authorization;
    const workoutId = req.params.workoutId;
    const name = utils.stripString(req.body.name);
    const description = utils.stripString(req.body.description);
    const datetime = req.body.datetime;
    user.validate(token).then(
        decoded => {
            /**
             * @todo Remove obsolete spaces and line breaks
             *
             * @todo Remove all leading/ending space from name
             *       Remove all new lines (\n) from name
             * @todo Remove all leading/ending space from description
             *       Remove alle multiple new lines and spaces from description
             */
             let valid = (workoutId === null || workoutId === undefined || !utils.numRegex(workoutId) ||
                         name === null || name === undefined || utils.empty(name) || !utils.simpleRegex(name) ||
                         description === null || description === undefined || utils.empty(description) || !utils.extendedRegex(description) ||
                         datetime === null || datetime === undefined || utils.empty(datetime) || !utils.numRegex(datetime))
            if(valid) {
                console.log("ERROR: POST /workout/:workoutId :: id, name, description or datetime are invalid");
                res.status(400).json({
                    type: "ERROR",
                    message: "id, name, description or datetime are invalid"
                });
            } else {
                console.log("INFO: POST /workout/:workoutId :: Updating workout");
                workout.updateWorkout({ id: workoutId, userId: decoded.sub, name: name, description: description, datetime: datetime }).then(
                    updatedId => {
                        console.log("OK: POST /workout/:workoutId :: Updated workout with id " + workoutId);
                        res.status(200).json({
                            id: parseInt(workoutId),
                            userId: decoded.sub,
                            name: name,
                            description: description,
                            datetime: parseInt(datetime)
                        });
                    },
                    error => {
                        console.log("ERROR: POST /workout/:workoutId ::", error.message);
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
            console.log("ERROR: POST /workout/:workoutId ::", error.message);
            res.status(401).json({type: "ERROR", message: error.message});
        },
    ).catch((error) => {
        console.log("ERROR: POST /workout/:workoutId :: An unexpected error has occurred ::", error.message);
    });
});

/**
 * DELETE requests
 * Delete workout with ID
 * @return 200 OK
 * @return 400 Bad Request
 * @return 401 Unauthorized
 * @return 500 Internal Server Error
 */
router.delete("/:workoutId", (req, res, next) => {
    console.log("Deleting workout");
    res.status(200).json({
        message: "Deleted workout"
    });
});

module.exports = router;
