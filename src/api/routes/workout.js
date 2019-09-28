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

// Variables
var database = "./db/db_whiteboard.db";

/**
 * Initialize
 */

const init = true;
if (init) {
    // Open database
    Database.open();
    // Init database
    Database.init();
    // Close Database
    Database.close();
}

/**
 * REST
 */

/**
 * GET requests
 * Get all workouts
 * @return 200 OK
 * @return 401 Unauthorized
 */
router.get("/", (req, res, next) => {
    console.log("Getting all workouts");
   
    var token = req.headers.authorization;
    if (!token) {
        res.status(401).json({
            type: "ERROR",
            message: "No token provided"
        });
    } else {
        // Verfiy token
        jwt.verify(token, config.secret, function(err, decoded) {
            console.log(JSON.stringify(decoded));
            console.log(decoded.sub);
            if (err) {
                res.status(401).json({
                    type: "ERROR",
                    message: "Failed to authenticate token"
                });
            } else {
                // open database
                var db = new sqlite3.Database(database, (err) => {
                    if (err) {
                        console.log("ERROR: GET /workout/ :: Connecting database.");
                        return console.error(err.message);
                    }
                });

                db.all("SELECT id, name, description, datetime FROM table_workout WHERE user_id = ? ORDER BY id", [decoded.sub], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    res.status(200).end(JSON.stringify(rows));

                    // close database
                    db.close((err) => {
                        if (err) {
                            console.log("ERROR: GET /workout/ :: Closing database");
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
 * Get workout with ID
 * @return 200 OK
 * @return 204 No Content
 * @return 400 Bad Request
 * @return 401 Unauthorized
 */
router.get("/:workoutId", (req, res, next) => {
    const id = req.params.workoutId;
    console.log("Getting workout with id " + id);

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
                    console.log("ERROR: GET /workout/:workoutId :: workoutId is invalid");
                    res.status(400).json({
                        type: "ERROR",
                        message: "workoutId is invalid"
                    });
                } else { 
                    // open database
                    var db = new sqlite3.Database(database, (err) => {
                        if (err) {
                            console.log("ERROR: GET /workout/:workoutId :: Connecting database.");
                            return console.error(err.message);
                        }
                    });

                    db.get("SELECT id, name, description FROM table_workout WHERE id = ? AND user_id = ?", [id, decoded.sub], (err, row) => {
                        if (err) {
                            return console.error(err.message);
                        }
                        if(row != null) {
                            res.status(200).end(JSON.stringify(row));
                        } else {
                            console.log("No workout found with the id ${id}");
                            res.status(204).json({
                                type: "INFO",
                                message: "No workout found"
                            });
                        }

                        // close database
                        db.close((err) => {
                            if (err) {
                                console.log("ERROR: GET /workout/:workoutId :: Closing database");
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
 * GET requests
 * Get workout scores with workout ID
 * @return 200 OK
 * @return 400 Bad Request
 * @return 401 Unauthorized
 */
router.get("/score/:workoutId", (req, res, next) => {
    const id = req.params.workoutId;
    console.log("Getting workout scores of workout with id " + id);

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
                    console.log("ERROR: GET /workout/score/:workoutId :: workoutId is invalid");
                    res.status(400).json({
                        type: "ERROR",
                        message: "workoutId is invalid"
                    });
                } else { 
                    // open database
                    var db = new sqlite3.Database(database, (err) => {
                        if (err) {
                            console.log("ERROR: GET /workout/score/:workoutId :: Connecting database.");
                            return console.error(err.message);
                        }
                    });

                    db.all("SELECT id, workout_id, score, datetime, note FROM table_workout_score WHERE workout_id = ? ORDER BY id", [id], (err, rows) => {
                        if (err) {
                            throw err;
                        }
                        res.status(200).end(JSON.stringify(rows));

                        // close database
                        db.close((err) => {
                            if (err) {
                                console.log("ERROR: GET /workout/score/:workoutId :: Closing database");
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
 * SAVE workout
 * @return 201 Created
 * @return 400 Bad Request
 * @return 401 Unauthorized
 */
router.post("/", (req, res, next) => {
    var name = utils.stripString(req.body.name);
    var description = utils.stripString(req.body.description);
    var datetime = req.body.datetime;
    
    console.log("Saving workout");

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
                 * @todo Remove obsolete spaces and line breaks
                 *
                 * @todo Remove all leading/ending space from name
                 *       Remove all new lines (\n) from name
                 * @todo Remove all leading/ending space from description
                 *       Remove alle multiple new lines and spaces from description
                 */
                let valid = (name == null || utils.empty(name) || !utils.simpleRegex(name) || 
                            description == null || utils.empty(description) || !utils.extendedRegex(description) ||  
                            datetime == null || utils.empty(datetime) || !utils.numRegex(datetime))
                if(valid) {
                    console.log("ERROR: POST /workout/ :: name, description or datetime are invalid");
                    res.status(400).json({
                        type: "ERROR",
                        message: "name, description or datetime are invalid"
                    });
                } else {
                    // open database
                    var db = new sqlite3.Database(database, (err) => {
                        if (err) {
                            console.log("ERROR: POST /workout/ :: Connecting database.");
                            return console.error(err.message);
                        }
                    });

                    // insert row
                    db.run("INSERT INTO table_workout(user_id, name, description, datetime) VALUES (?, ?, ?, ?)", [decoded.sub, name, description, datetime], function(err) {
                        if (err) {
                            return console.log(err.message);
                        }
                        console.log("Inserted new workout");
                        res.status(201).json({
                            type: "SUCCESS",
                            message: "Workout was created",
                            result: req.body
                        });
                    });

                    // close database
                    db.close((err) => {
                        if (err) {
                            console.log("ERROR: POST /workout/ :: Closing database");
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
 * Patch workout with ID
 * @return 200 OK
 * @return 400 Bad Request
 * @return 401 Unauthorized
 */
router.post("/:workoutId", (req, res, next) => {
    var id = req.params.workoutId;
    var name = utils.stripString(req.body.name);
    var description = utils.stripString(req.body.description);
    var datetime = req.body.datetime;
    
    console.log("Updating workout");

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
                let valid = (id == null || !utils.numRegex(id) ||
                            name == null || utils.empty(name) || !utils.simpleRegex(name) || 
                            description == null || utils.empty(description) || !utils.extendedRegex(description) ||  
                            datetime == null || utils.empty(datetime) || !utils.numRegex(datetime))
                if(valid) {
                    console.log("ERROR: POST /workout/:workoutId :: id, name, description or datetime are invalid");
                    res.status(400).json({
                        type: "ERROR",
                        message: "id, name, description or datetime are invalid"
                    });
                } else {
                    // open database
                    var db = new sqlite3.Database(database, (err) => {
                        if (err) {
                            console.log("ERROR: POST /workout/:workoutId :: Connecting database.");
                            return console.error(err.message);
                        }
                    });

                    db.run("UPDATE table_workout SET name=?, description=?, datetime=? WHERE id=?", [name, description, datetime, id], function(err) {
                        if (err) {
                            return console.log(err.message);
                        }
                        console.log("Updated workout with id " + id);
                        res.status(200).json({
                            type: "SUCCESS",
                            message: "Workout was updated",
                            result: req.body
                        });
                    });

                    // close database
                    db.close((err) => {
                        if (err) {
                            console.log("ERROR: POST /workout/:workoutId :: Closing database");
                            return console.error(err.message);
                        }
                    });
                }
            }
        });
    }
});

/**
 * DELETE requests
 * Delete workout with ID
 * @return 200 OK
 * @return 400 Bad Request
 * @return 401 Unauthorized
 */ 
router.delete("/:workoutId", (req, res, next) => {
    console.log("Deleting workout");
    res.status(200).json({
        message: "Deleted workout"
    });
});

module.exports = router;
