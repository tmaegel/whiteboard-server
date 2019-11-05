// Database

const sqlite3 = require("sqlite3").verbose();
var Server = require('./server');

function open() {
    // open database
    db = new sqlite3.Database(Server.database, (err) => {
        if (err) {
            console.log("ERROR: Connecting database.");
            return console.error(err.message);
        }
        console.log("Opened database " + Server.database);
    });
}

function init() {
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
        // id, movement, equipment_ids
        db.run("CREATE TABLE IF NOT EXISTS table_movements (id INTEGER PRIMARY KEY AUTOINCREMENT, movement TEXT, equipment_ids TEXT)");
        // id, score, datetime (the number of seconds since 1970-01-01 00:00:00 UTC)
        db.run("CREATE TABLE IF NOT EXISTS table_workout (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, name TEXT, description TEXT, datetime INTEGER)");
        // id, score, datetime (the number of seconds since 1970-01-01 00:00:00 UTC)
        db.run("CREATE TABLE IF NOT EXISTS table_workout_score (id INTEGER PRIMARY KEY AUTOINCREMENT, workout_id INTEGER, score TEXT, datetime INTEGER, note TEXT)");

        /**
         * Users
         */

        // username, password
        var users = [
             ['user', '2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b']
        ];

         for (var row in users) {
             set = users[row];
             let sql = "INSERT INTO table_users (name, password) VALUES (?, ?)";
             db.run(sql, set, function(err) {
                 if (err) {
                     return console.error(err.message);
                 }
                 console.log(`User inserted ${this.changes}`);
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
                 console.log(`Equipment inserted ${this.changes}`);
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
             let sql = "INSERT INTO table_movements (movement, equipment_ids) VALUES (?, ?)";
             db.run(sql, set, function(err) {
                 if (err) {
                     return console.error(err.message);
                 }
                 console.log(`Movement inserted ${this.changes}`);
             });
         }

        /**
         * Workouts
         */

        /*var datetime = new Date();
        var now = Math.round(datetime.getTime()/1000);

        var workouts = [
            ['Angi' ,'For Time\n100 Pull-ups\n100 Push-ups\n100 Sit-ups\n100 Squats', now],
            ['Cindy' ,'AMRAP20\n5 Pull-ups\n10 Push-ups\n15 Squats', now],
            ['Eva' ,'5RFT\n800m run\n30 Kettle swings @32kg\n30 Pull-ups', now],
            ['Chelsea' ,'EMOM30\n5 Pull-ups\n10 Push-ups\n15 Squats', now],
            ['Fran' ,'21 - 15 - 9\nThruster @43kg\nPull-ups', now],
            ['Grace' ,'For time\n30 Clean & Jerk @61kg', now],
            ['Isabel' ,'For time\n30 Snatch @61kg', now],
            ['Alexander' ,'5RFT\n31 Backsquats @61kg\n12 Power clean @84kg', now]
        ];

        for (var row in workouts) {
            set = workouts[row];
            let sql = "INSERT INTO table_workout (name, description, datetime) VALUES (?, ?, ?)";
            db.run(sql, set, function(err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`Workout inserted ${this.changes}`);
            });
        }*/

        /**
         * Workout scores
         */

        /*var scores = [
            [1, '00:24:40', 1460239200, 'note 1'],
            [1, '00:18:12', 1490997600, 'note 2'],
            [1, '00:16:30', 1495836000, 'note 3'],
            [2, '480', 1447887600, '...'],
            [2, '461', 1461276000, '...'],
            [2, '638', 1465423200, '...'],
            [2, '750', 1477778400, '...'],
            [2, '699', 1481151600, '...'],
            [2, '760', 1524952800, '...'],
            [2, '773', 1541433600, '...'],
            [5, '00:11:04', 1441144800, ''],
            [5, '00:07:10', 1463781600, ''],
            [5, '00:05:40', 1463954400, ''],
            [5, '00:03:50', 1476655200, ''],
            [5, '00:03:08', 1501279200, ''],
            [5, '00:02:56', 1525816800, ''],
            [6, '00:04:27', 1468879200, ''],
            [6, '00:03:38', 1476741600, ''],
            [6, '00:02:51', 1485990000, ''],
            [6, '00:02:31', 1523484000, ''],
            [7, '00:04:57', 1502920800, ''],
            [7, '00:03:15', 1518130800, '']
        ];

        for (var row in scores) {
            set = scores[row];
            let sql = "INSERT INTO table_workout_score (workout_id, score, datetime, note) VALUES (?, ?, ?, ?)";
            db.run(sql, set, function(err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`Workout score inserted ${this.changes}`);
            });
        }*/
    })
}

function close() {
    // close the database connection
    db.close((err) => {
        if (err) {
            console.log("ERROR: Closing database");
            return console.error(err.message);
        }
        console.log("Closed database " + Server.database);
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
