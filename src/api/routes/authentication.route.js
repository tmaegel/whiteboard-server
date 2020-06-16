const express = require("express");
const fs = require('fs');
const bodyParser = require("body-parser");
const router = express.Router();

router.use(bodyParser.json());

// Importing objects
const utils = require("../../helpers/utils.helper.js");
const database = require("../../models/sqlite.model.js");
const user = require("../../models/user.model.js");

/**
 * GET requests
 * Get logged in user details (validate token)
 * @return 200 OK
 * @return 401 Unauthorized
 */
router.get("/validate", (req, res, next) => {
    const token = req.headers.authorization;
    user.validate(token).then(
        decoded => {
            console.log("OK: GET /authentication/validate");
            res.status(200).send(decoded);
        },
        error => {
            // No token provided
            // Failed to authenticate token
            console.log("ERROR: GET /authentication/validate ::", error.message);
            res.status(401).json({type: "ERROR", message: error.message});
        },
    ).catch((error) => {
        console.log("ERROR: GET /authentication/validate :: An unexpected error has occurred ::", error.message);
    });
});

/**
 * POST requests
 * Login the user
 * @return 200 OK
 * @return 400 Bad Request
 * @return 401 Unauthorized
 * @return 403 Forbidden
 * @return 500 Internal Server Error
 */
router.post("/login", (req, res, next) => {
    const username = req.body.name;
    const password = req.body.password;

    let valid = (username === undefined || username === null || utils.empty(username) ||
                password === undefined || password === null || utils.empty(password));
    if(valid) {
        console.log("ERROR: POST /authentication/login :: username or password are invalid");
        res.status(400).json({
            type: "ERROR",
            message: "username or password are invalid"
        });
    } else {
        user.login(username).then(
            result => {
                console.log("OK: POST /authentication/login");
                if(result !== null && result !== undefined && Object.keys(result).length === 3) {
                    user.sign(result, result.password, password).then(
                        result => {
                            console.log("OK: GET /authentication/login");
                            res.status(200).json({
                                type: "SUCCESS",
                                message : "User login successfully",
                                token : result
                            });
                        },
                        error => {
                            // password is invalid
                            console.log("ERROR: POST /authentication/login ::", error.message);
                            res.status(403).json({type: "ERROR", message: error.message});
                        },
                    ).catch((error) => {
                        console.log("ERROR: POST /authentication/login :: An unexpected error has occurred ::", error.message);
                    });
                } else {
                    console.log("ERROR: POST /authentication/login :: username is invalid");
                    res.status(403).json({
                        type: "ERROR",
                        message: "username is invalid"
                    });
                }
            },
            error => {
                console.log("ERROR: POST /authentication/login ::", error.message);
                res.status(500).json({
                    type: "ERROR",
                    message: "Internal Server Error"
                });
            },
        ).catch((error) => {
            console.log("ERROR: POST /authentication/login :: An unexpected error has occurred ::", error.message);
        });
    }
});

module.exports = router;
