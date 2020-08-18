/**
 * sqlite/database module
 * @module models/sqlite.model
 * @see module:models/sqlite.model
 */

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
    console.log("INFO: sqlite.model.js :: open() :: Connecting database '" + cmdline.dbFile + "'");
    db = new sqlite3.Database(cmdline.dbFile, (err) => {
        if (err) {
            console.log("ERROR: sqlite :: open() :: Connecting database.");
            return console.error(err.message);
        }
        console.log("INFO: sqlite.model.js :: open() :: Opened database " + cmdline.dbFile);
    });
}

function init(data) {
    console.log("INFO: sqlite.model.js :: init() :: Initialize database " + cmdline.dbFile);
    db.serialize(function() {
        // **** REMOVING IT LATER
        db.run("DROP TABLE IF EXISTS table_users");
        db.run("DROP TABLE IF EXISTS table_tags");
        db.run("DROP TABLE IF EXISTS table_equipment");
        db.run("DROP TABLE IF EXISTS table_movements");
        db.run("DROP TABLE IF EXISTS table_workout");
        db.run("DROP TABLE IF EXISTS table_workout_score");
        db.run("DROP TABLE IF EXISTS table_workout_tags");

        // id, name, password (hash)
        db.run("CREATE TABLE IF NOT EXISTS table_users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT)"); // @todo: Nur für erste Tests im Klartext
        // id, tag
        db.run("CREATE TABLE IF NOT EXISTS table_tags (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, tag TEXT)");
        // id, equipment
        db.run("CREATE TABLE IF NOT EXISTS table_equipment (id INTEGER PRIMARY KEY AUTOINCREMENT, equipment TEXT)");
        // id, movement, equipmentIds
        db.run("CREATE TABLE IF NOT EXISTS table_movements (id INTEGER PRIMARY KEY AUTOINCREMENT, movement TEXT, equipmentIds TEXT)");
        // id, score, datetime (the number of seconds since 1970-01-01 00:00:00 UTC)
        db.run("CREATE TABLE IF NOT EXISTS table_workout (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, name TEXT, description TEXT, datetime INTEGER)");
        // id, score, datetime (the number of seconds since 1970-01-01 00:00:00 UTC)
        db.run("CREATE TABLE IF NOT EXISTS table_workout_score (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, workoutId INTEGER, score TEXT, rx BOOL, datetime INTEGER, note TEXT)");
        // id, workoutId, tagId
        db.run("CREATE TABLE IF NOT EXISTS table_workout_tags (id INTEGER PRIMARY KEY AUTOINCREMENT, workoutId INTEGER, tagId INTEGER)");

        /**
         * Users
         * @todo: Uses user.model / workout.model for access to the database
         */
        for (let user of data.users) {
            db.run("INSERT INTO table_users(name, password) VALUES (?, ?)", [user.name, user.hash], function(error) {
                if (error) {
                    return console.error(error.message);
                }
                console.log("DEBUG: sqlite :: init() :: Inserted users " + user.name + " with id " + this.lastID);
                if(user.workouts !== null && user.workouts !== undefined) {
                    console.log("DEBUG: sqlite.model.js :: init() :: Found workouts of user " + user.name);
                    db.get("SELECT id, name, password FROM table_users WHERE name = ? LIMIT 1", [user.name], function(error, result) {
                        if (error) {
                            console.log("ERROR: sqlite.model.js :: init() :: Couldn't get user " + user.name);
                        } else {
                            for (let workout of user.workouts) {
                                db.run("INSERT INTO table_workout(userId, name, description, datetime) VALUES (?, ?, ?, ?)", [result.id, workout.name, workout.description, workout.datetime], function(error) {
                                    if (error) {
                                        return console.error(error.message);
                                    } else {
                                        console.log("DEBUG: sqlite.model.js :: init() :: Inserted workout " + workout.name + " (" + user.name + ") with id " + this.lastID);
                                        for (let tag of workout.tag) {
                                            db.run("INSERT INTO table_workout_tags(workoutId, tagId) VALUES (?, ?)", [this.lastID, tag], function(error) {
                                                if (error) {
                                                    return console.error(error.message);
                                                } else {
                                                    console.log("DEBUG: sqlite.model.js :: init() :: Inserted tag id " + tag + " (" + user.name + ") with workout id " + this.lastID + " with id " + this.lastID);
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
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
                console.log("DEBUG: sqlite.model.js :: init() :: Inserted equipment " + equipment.name + " with id " + this.lastID);
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
                console.log("DEBUG: sqlite.model.js :: init() :: Inserted movement " + movement.name + " with id " + this.lastID);
            });
        }

        /**
         * Tags
         */
        for (let tag of data.tags) {
            // Inserting tag with userId 1
            db.run("INSERT INTO table_tags(userId, tag) VALUES (?, ?)", [1, tag.name], function(error) {
                if (error) {
                    return console.error(error.message);
                }
                console.log("DEBUG: sqlite.model.js :: init() :: Inserted tag " + tag.name + " with id " + this.lastID);
            });
        }
    })
}

function close() {
    // close the database connection
    db.close((err) => {
        if (err) {
            console.log("ERROR: sqlite.model.js :: close() :: Closing database.");
            return console.error(err.message);
        }
        console.log("INFO: sqlite.model.js :: close() :: Closed database " + cmdline.dbFile);
    });
}

module.exports = {
    db,
    init,
    open,
    close,
};
