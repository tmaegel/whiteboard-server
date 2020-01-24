const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Importing objects
const User = require('../obj/User');
const database = require("./sqlite.model.js");
const config = require("../config.json");

function validate(token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            reject(new Error("No token provided"));
        } else {
            jwt.verify(token, config.secret, function(error, decoded) {
                if (error) {
                    console.log("DEBUG: user.model.js :: validate() ::", error.message);
                    reject(new Error("Failed to authenticate token"));
                } else {
                    resolve(decoded);
                }
            });
        }
    });
}

function sign(object, hash, password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, function(error, matched) {
            if (error) {
                console.log("DEBUG: user.model.js :: sign() ::", error.message);
                reject(error);
            } else if (!matched) {
                reject(new Error("password is invalid"));
            } else {
                // create a token
                let user = new User(object.id, object.name);
                let token = jwt.sign({ id: user._id, sub: user.sub, name: user.name }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                resolve(token);
            }
        });
    });
}

function login(username) {
    return new Promise((resolve, reject) => {
        database.db.get("SELECT id, name, password FROM table_users WHERE name = ? LIMIT 1", [username], function(error, result) {
            if (error) {
                console.log("DEBUG: user.model.js :: login() ::", error.message);
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = {
    validate,
    sign,
    login,
};
