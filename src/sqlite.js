// Database

const sqlite3 = require("sqlite3").verbose();
var Server = require('./server');

function open() {
    // open database
    db = new sqlite3.Database(Server.database, (err) => {
        if (err) {
            console.log("sqlite :: open() :: ERROR: Connecting database.");
            return console.error(err.message);
        }
        console.log("sqlite :: open() :: Opened database " + Server.database);
    });
}

function init() {
    console.log("sqlite :: init() :: Initialize database " + Server.database);
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

        // Remove this!
        // These data are for development only
        // admin must be added first (userId 1), then the other user
        var users = [
            ['admin', '$2a$10$0zn4Pb8khNP/qPGDoQXr2uOQYaFXBk53lVu7xl4WRvExptGzbaKyK'],
            ['user', '$2a$10$Q0X4lrRRIvWoLFoiX3CvAO/8fesQsnMR.tQxyBYjzuoSSm4W9IFKe']
        ];

        for (var row in users) {
            set = users[row];
            let sql = "INSERT INTO table_users (name, password) VALUES (?, ?)";
            db.run(sql, set, function(err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log("sqlite :: init() :: User inserted.");
            });
        }

        /**
         * Equipment
         */

        var equipment = [
            ['None'],
            ['Box'],
            ['Wallball'],
            ['Dumbell']
        ];

        for (var row in equipment) {
            set = equipment[row];
            let sql = "INSERT INTO table_equipment (equipment) VALUES (?)";
            db.run(sql, set, function(err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log("sqlite :: init() :: Equipment inserted.");
            });
        }

        /**
         * Movements
         */

        var movements = [
            ['Box jumps', '2'],
            ['Burpee box jumps', '2'],
            ['Box steps', '2'],
            ['Box steps over', '2'],
            ['Burpee', '1'],
            ['Burpee box jumps', '2'],
            ['Burpee box jumps over', '2'],
            ['Wallball shots', '3'],
            ['Dumbell snatch', '4']
        ];

        for (var row in movements) {
            set = movements[row];
            let sql = "INSERT INTO table_movements (movement, equipmentIds) VALUES (?, ?)";
            db.run(sql, set, function(err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log("sqlite :: init() :: Movement inserted.");
            });
        }
    })
    console.log("sqlite :: init() :: Initializiation finished.");
}

function close() {
    // close the database connection
    db.close((err) => {
        if (err) {
            console.log("sqlite :: close() :: ERROR: Closing database.");
            return console.error(err.message);
        }
        console.log("sqlite :: close() :: Closed database " + Server.database);
    });
}


function insert(name, description) {
    if(name == null || description == null) {
        return console.log("ERROR: Null values are not allowed");
    }

    // insert one row into the table_workout
    db.run("INSERT INTO table_workout(name, description) VALUES (?, ?)", [name, description], function(err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log("A row has been inserted with rowid ${this.lastID}");
    });
}

function select() {
    console.log("Query one data set");
    var sql = "SELECT id, name, description FROM table_workout WHERE id  = ?";
    var workoutId = 2;
    db.get(sql, [workoutId], (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      return row
        ? console.log(row.id, row.name, row.description)
        : console.log("No data set found with the id ${workoutId}");
    });

}

function select_all() {
    console.log("Query all data");
    var data =  [];
    var sql = "SELECT id, name, description FROM table_workout ORDER BY id";
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows);
    });
}

exports.open = open;
exports.init = init;
exports.close = close;
