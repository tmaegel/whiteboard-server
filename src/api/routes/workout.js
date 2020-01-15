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
 * REST
 */

/**
 * GET requests
 * Get all workouts
 * @return 200 OK
 * @return 401 Unauthorized
 */
router.get("/", (req, res, next) => {
    var token = req.headers.authorization;
    if (!token) {
        console.log("ERROR: GET /workout :: No token provided");
        res.status(401).json({
            type: "ERROR",
            message: "No token provided"
        });
    } else {
        // Verfiy token
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                console.log("ERROR: GET /workout :: Failed to authenticate token");
                res.status(401).json({
                    type: "ERROR",
                    message: "Failed to authenticate token"
                });
            } else {
                // open database
                var db = new sqlite3.Database(Server.database, (err) => {
                    if (err) {
                        console.log("ERROR: GET /workout/ :: Connecting database.");
                        return console.error(err.message);
                    }
                });
                // Select all workouts with userId 1 or the regular userId
                db.all("SELECT id, userId, name, description, datetime FROM table_workout WHERE userId = 1 OR userId = ? ORDER BY id", [decoded.sub], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    console.log("OK: GET /workout");
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
    var token = req.headers.authorization;
    if (!token) {
        console.log("ERROR: GET /workout/:workoutId :: No token provided");
        res.status(401).json({
            type: "ERROR",
            message: "No token provided"
        });
    } else {
        // Verfiy token
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                console.log("ERROR: GET /workout/:workoutId :: Failed to authenticate token");
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
                    console.log("INFO: GET /workout/:workoutId :: workoutId is " + id);
                    // open database
                    var db = new sqlite3.Database(Server.database, (err) => {
                        if (err) {
                            console.log("ERROR: GET /workout/:workoutId :: Connecting database.");
                            return console.error(err.message);
                        }
                    });
                    // Select workout with userId 1 or the regular userId
                    db.get("SELECT id, userId, name, description FROM table_workout WHERE id = ? AND (userId = 1 OR userId = ?)", [id, decoded.sub], (err, row) => {
                        if (err) {
                            return console.error(err.message);
                        }
                        if(row != null) {
                            console.log("OK: GET /workout/:workoutId");
                            res.status(200).end(JSON.stringify(row));
                        } else {
                            console.log("OK: GET /workout/:workoutId :: No workout found with the id " + id);
                            res.sendStatus(204);
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
    var token = req.headers.authorization;
    if (!token) {
        console.log("ERROR: GET /workout/score/:workoutId :: No token provided");
        res.status(401).json({
            type: "ERROR",
            message: "No token provided"
        });
    } else {
        // Verfiy token
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                console.log("ERROR: GET /workout/score/:workoutId :: Failed to authenticate token");
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
                    console.log("INFO: GET /workout/score/:workoutId :: workoutId is " + id);
                    // open database
                    var db = new sqlite3.Database(Server.database, (err) => {
                        if (err) {
                            console.log("ERROR: GET /workout/score/:workoutId :: Connecting database.");
                            return console.error(err.message);
                        }
                    });
                    // Select only workout scores with the userId of the registered user
                    db.all("SELECT id, workoutId, score, rx, datetime, note FROM table_workout_score WHERE workoutId = ? and userId = ? ORDER BY id", [id, decoded.sub], (err, rows) => {
                        if (err) {
                            throw err;
                        }
                        console.log("OK: GET /workout/score/:workoutId");
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
 * @return 500 Internal Server Error
 */
router.post("/", (req, res, next) => {
    var name = utils.stripString(req.body.name);
    var description = utils.stripString(req.body.description);
    var datetime = req.body.datetime;
    var token = req.headers.authorization;
    if (!token) {
        console.log("ERROR: POST /workout :: No token provided");
        res.status(401).json({
            type: "ERROR",
            message: "No token provided"
        });
    } else {
        // Verfiy token
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                console.log("ERROR: POST /workout :: Failed to authenticate token");
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
                    console.log("ERROR: POST /workout :: name, description or datetime are invalid");
                    res.status(400).json({
                        type: "ERROR",
                        message: "name, description or datetime are invalid"
                    });
                } else {
                    // open database
                    var db = new sqlite3.Database(Server.database, (err) => {
                        if (err) {
                            console.log("ERROR: POST /workout :: Connecting database.");
                            return console.error(err.message);
                        }
                    });
                    // insert row
                    db.run("INSERT INTO table_workout(userId, name, description, datetime) VALUES (?, ?, ?, ?)", [decoded.sub, name, description, datetime], function(err) {
                        if (err) {
                            return console.log(err.message);
                        }
                        db.get("SELECT last_insert_rowid() from table_workout WHERE userId = ? LIMIT 1", [decoded.sub], (err, row) => {
                            if (err) {
                                return console.error(err.message);
                            }
                            if(row != null) {
                                let id = row["last_insert_rowid()"];
                                console.log("INFO: POST /workout :: Inserted new workout with id " + id);
                                db.get("SELECT id, userId, name, description, datetime FROM table_workout WHERE id = ? AND (userId = 1 OR userId = ?)", [id, decoded.sub], (err, row) => {
                                    if (err) {
                                        return console.error(err.message);
                                    }
                                    if(row != null) {
                                        console.log("OK: POST /workout :: Inserted workout with id " + id);
                                        res.status(201).end(JSON.stringify(row));
                                    } else {
                                        console.log("ERROR: POST /workout :: No workout found with the id " + id);
                                        res.status(500).json({
                                            type: "ERROR",
                                            message: "No workout found with the id " + id
                                        });
                                    }
                                });
                            }
                        });
                    });
                    // close database
                    db.close((err) => {
                        if (err) {
                            console.log("ERROR: POST /workout :: Closing database");
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
    var token = req.headers.authorization;
    if (!token) {
        console.log("ERROR: POST /workout/:workoutId :: No token provided");
        res.status(401).json({
            type: "ERROR",
            message: "No token provided"
        });
    } else {
        // Verfiy token
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                console.log("ERROR: POST /workout/:workoutId :: Failed to authenticate token");
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
                    console.log("INFO: POST /workout/:workoutId :: workoutId is " + id);
                    // open database
                    var db = new sqlite3.Database(Server.database, (err) => {
                        if (err) {
                            console.log("ERROR: POST /workout/:workoutId :: Connecting database.");
                            return console.error(err.message);
                        }
                    });
                    /**
                     *  @todo: Gib eine Fehlermeldung zurück, wenn kein Workout aktualisiert wurde (bspw. admin workouts)
                     */
                    db.run("UPDATE table_workout SET name = ?, description = ?, datetime = ? WHERE id = ? AND userId = ?", [name, description, datetime, id, decoded.sub], function(err) {
                        if (err) {
                            return console.log(err.message);
                        }
                        console.log("OK: POST /workout/:workoutId :: Updated workout with id " + id);
                        res.status(200).json({
                            id: parseInt(id),
                            userId: decoded.sub,
                            name: name,
                            description: description,
                            datetime: parseInt(datetime)
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
