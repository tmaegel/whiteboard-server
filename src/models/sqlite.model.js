// Database
const sqlite3 = require("sqlite3").verbose();

// Importing objects
const cmdline = require("../cmdline");

let db;

/**
 * Open database
 */
open();

/**
 * Initialize database
 */
if (cmdline.initDatabase) {
    init(cmdline.data);
}

function open() {
    // open database
    console.log("INFO: sqlite :: open() :: Connecting database '" + cmdline.dbFile + "'");
    db = new sqlite3.Database(cmdline.dbFile, (err) => {
        if (err) {
            console.log("ERROR: sqlite :: open() :: Connecting database.");
            return console.error(err.message);
        }
        console.log("INFO: sqlite :: open() :: Opened database " + cmdline.dbFile);
    });
}

function init(data) {
    console.log("INFO: sqlite :: init() :: Initialize database " + cmdline.dbFile);
    db.serialize(function() {
        // **** REMOVING IT LATER
        db.run("DROP TABLE IF EXISTS table_users");
        db.run("DROP TABLE IF EXISTS table_equipment");
        db.run("DROP TABLE IF EXISTS table_movements");
        db.run("DROP TABLE IF EXISTS table_workout");
        db.run("DROP TABLE IF EXISTS table_workout_score");

        // id, equipment
        db.run("CREATE TABLE IF NOT EXISTS table_users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT)"); // @todo: Nur für erste Tests im Klartext
        // id, equipment
        db.run("CREATE TABLE IF NOT EXISTS table_equipment (id INTEGER PRIMARY KEY AUTOINCREMENT, equipment TEXT)");
        // id, movement, equipmentIds
        db.run("CREATE TABLE IF NOT EXISTS table_movements (id INTEGER PRIMARY KEY AUTOINCREMENT, movement TEXT, equipmentIds TEXT)");
        // id, score, datetime (the number of seconds since 1970-01-01 00:00:00 UTC)
        db.run("CREATE TABLE IF NOT EXISTS table_workout (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, name TEXT, description TEXT, datetime INTEGER)");
        // id, score, datetime (the number of seconds since 1970-01-01 00:00:00 UTC)
        db.run("CREATE TABLE IF NOT EXISTS table_workout_score (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, workoutId INTEGER, score TEXT, rx BOOL, datetime INTEGER, note TEXT)");

        /**
         * Users
         */
        for (let user of data.users) {
            db.run("INSERT INTO table_users(name, password) VALUES (?, ?)", [user.name, user.hash], function(error) {
                if (error) {
                    return console.error(error.message);
                }
                console.log("INFO: sqlite :: init() :: Inserted users " + user.name);
            });
        }

        /**
         * Equipment
         */
        for (let equipment of data.equipment) {
            db.run("INSERT INTO table_equipment(equipment) VALUES (?)", [equipment.name], function(error) {
                if (error) {
                    return console.error(error.message);
                }
                console.log("INFO: sqlite :: init() :: Inserted equipment " + equipment.name);
            });
        }

        /**
         * Movements
         */
        for (let movement of data.movements) {
            db.run("INSERT INTO table_movements(movement, equipmentIds) VALUES (?, ?)", [movement.name, movement.equipmentIds], function(error) {
                if (error) {
                    return console.error(error.message);
                }
                console.log("INFO: sqlite :: init() :: Inserted movement " + movement.name);
            });
        }

        /**
         * Workouts
         */
        for (let workout of data.workouts) {
            // The default userId of default workouts is 1 (admin: visible from everyone; editable only by admin)
            db.run("INSERT INTO table_workout(userId, name, description, datetime) VALUES (?, ?, ?, ?)", [1, workout.name, workout.description, workout.datetime], function(error) {
                if (error) {
                    return console.error(error.message);
                }
                console.log("INFO: sqlite :: init() :: Inserted workout " + workout.name);
            });
        }
    })
    console.log("INFO: sqlite :: init() :: Initializiation finished.");
}

function close() {
    // close the database connection
    db.close((err) => {
        if (err) {
            console.log("ERROR: sqlite :: close() :: Closing database.");
            return console.error(err.message);
        }
        console.log("INFO: sqlite :: close() :: Closed database " + cmdline.dbFile);
    });
}

module.exports = {
    db,
    init,
    open,
    close,
};
