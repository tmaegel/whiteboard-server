const express = require("express");
const fs = require('fs');
const bodyParser = require("body-parser");
const router = express.Router();

router.use(bodyParser.json());

// Importing objects
const database = require("../../models/sqlite.model.js");
const user = require("../../models/user.model.js");
const movement = require("../../models/movement.model.js");

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
            movement.getAll().then(
                results => {
                    console.log("OK: GET /movement");
                    res.status(200).end(JSON.stringify(results));
                },
                error => {
                    console.log("ERROR: GET /equipment ::", error.message);
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
            console.log("ERROR: GET /equipment ::", error.message);
            res.status(401).json({type: "ERROR", message: error.message});
        },
    ).catch((error) => {
        console.log("ERROR: GET /equipment :: An unexpected error has occurred ::", error.message);
    });
});

module.exports = router;
