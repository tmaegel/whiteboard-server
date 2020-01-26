const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Importing objects
const authenticationRoute = require("./api/routes/authentication.route.js");
const equipmentRoute = require("./api/routes/equipment.route.js");
const movementRoute = require("./api/routes/movement.route.js");
const workoutRoute = require("./api/routes/workout.route.js");
const scoreRoute = require("./api/routes/score.route.js");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Give access to any origin
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    ); // Allowing headers
    if(req.method === "OPTIONS") {
        res.header("Acess-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET"); // Allowing options
        return res.status(200).json({});
    }
    next();
});

// Requests are forwarded to authentication.route.js
app.use("/authentication", authenticationRoute);

// Requests are forwarded to score.route.js
app.use("/equipment", equipmentRoute);

// Requests are forwarded to score.route.js
app.use("/movement", movementRoute);

// Requests are forwarded to workouts.route.js
app.use("/workout", workoutRoute);

// Requests are forwarded to score.route.js
app.use("/score", scoreRoute);

// Error handling for not supported requests
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
