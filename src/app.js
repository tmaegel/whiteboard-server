const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Importing objects
const authenticationRoutes = require("./api/routes/authentication");
const equipmentRoutes = require("./api/routes/equipment");
const movementRoutes = require("./api/routes/movement");
const workoutRoutes = require("./api/routes/workout");
const scoreRoutes = require("./api/routes/score");

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

// Requests are forwarded to authentication.js
app.use("/authentication", authenticationRoutes);

// Requests are forwarded to score.js
app.use("/equipment", equipmentRoutes);

// Requests are forwarded to score.js
app.use("/movement", movementRoutes);

// Requests are forwarded to workouts.js
app.use("/workout", workoutRoutes);

// Requests are forwarded to score.js
app.use("/score", scoreRoutes);

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
