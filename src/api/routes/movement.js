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
    console.log("Getting all movements");
    
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
                        console.log("ERROR: GET /movement/ :: Connecting database.");
                        return console.error(err.message);
                    }
                });

                db.all("SELECT id, movement, equipment_ids FROM table_movements ORDER BY id", [], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    res.status(200).end(JSON.stringify(rows));

                    // close database
                    db.close((err) => {
                        if (err) {
                            console.log("ERROR: GET /movement/ :: Closing database");
                            return console.error(err.message);
                        }
                    });
                });
            }
        });
    }
});

module.exports = router;
