const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const fs = require('fs');
const bodyParser = require("body-parser");
const router = express.Router();

router.use(bodyParser.json());

// jwt
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

// config
var config = require("../../config");

// utils
var utils = require("../../utils");

// Exporting objects
var Database = require("../../sqlite");
var User = require('../../obj/User');

// Variables
var database = "./db/db_whiteboard.db";

/**
 * GET requests
 * Get logged in user details (validate token)
 * @return 200 OK
 * @return 401 Unauthorized
 */
router.get("/validate", (req, res, next) => {
    var token = req.headers.authorization;

    console.log("Validate logged in user");
    if (!token) {
        res.status(401).json({
            type: "ERROR",
            message: "No token provided"
        });
    }

    // @todo read secret from database
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            res.status(401).json({
                type: "ERROR",
                message: "Failed to authenticate token"
            });
        }
        res.status(200).send(decoded);
    });
});


/** 
 * POST requests
 * Login the user
 * @return 200 OK
 * @return 400 Bad Request
 * @return 401 Unauthorized
 * @return 403 Forbidden
 */
router.post("/login", (req, res, next) => {
    var user;
    var name = req.body.name;
    var password = req.body.password;

    console.log(req.body);

    console.log("Login the user " + name);
    if(name == null || !utils.wordRegex(name) || password == null || !utils.wordRegex(password)) { // @todo no wordRegex check for password
        console.log("ERROR: POST /authentication/login/ :: username or password are null or contains forbidden characters");
        res.status(400).json({
            type: "ERROR",
            message: "username or password are null or contains forbidden characters"
        });
    } else { 
        // open database
        var db = new sqlite3.Database(database, (err) => {
            if (err) {
                console.log("ERROR: POST /authentication/login/ :: Connecting database.");
                return console.error(err.message);
            }
        });

        // @todo var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        db.get("SELECT id, name, password FROM table_users WHERE name = ? LIMIT 1", [name], (err, row) => {
            if (err) {
                throw err;
            }

            console.log(JSON.stringify(row));

            if(row != null && Object.keys(row).length === 3) {
                if(row.name == name && row.password == password) {
                    // The second argument is the number of rounds to use when generating a sall
                    var user = new User(row.id, name, bcrypt.hashSync(req.body.password, 10));
                    
                    // create a token
                    var token = jwt.sign({ id: user._id, sub: user.sub, name: user.name }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });

                    res.status(200).json({
                        type: "SUCCESS", 
                        message : "User login successfully",
                        token : token
                    });
                } else {
                    console.log("ERROR: POST /authentication/login/ :: password is invalid");
                    res.status(403).json({
                        type: "ERROR",
                        message: "password is invalid"
                    });
                }
            } else { 
                console.log("ERROR: POST /authentication/login/ :: username is invalid");
                res.status(403).json({
                    type: "ERROR",
                    message: "username is invalid"
                });
            }
 
            // close database
            db.close((err) => {
                if (err) {
                    console.log("ERROR: POST /authentication/login/ :: Closing database");
                    return console.error(err.message);
                }
            });
        });
    }
});

module.exports = router;
