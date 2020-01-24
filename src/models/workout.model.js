const database = require("./sqlite.model.js");

function getWorkouts(userId) {
    return new Promise((resolve, reject) => {
        database.db.all("SELECT id, userId, name, description, datetime FROM table_workout WHERE userId = 1 OR userId = ? ORDER BY id", [userId], function(error, results) {
            if (error) {
                console.log("DEBUG: workout.model.js :: getWorkouts() ::", error.message);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function getWorkoutById(userId, workoutId) {
    return new Promise((resolve, reject) => {
        database.db.get("SELECT id, userId, name, description, datetime FROM table_workout WHERE id = ? AND (userId = 1 OR userId = ?)", [workoutId, userId], function(error, result) {
            if (error) {
                console.log("DEBUG: workout.model.js :: getWorkoutById() ::", error.message);
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

function getWorkoutScoresById(userId, workoutId) {
    return new Promise((resolve, reject) => {
        database.db.all("SELECT id, workoutId, score, rx, datetime, note FROM table_workout_score WHERE workoutId = ? and userId = ? ORDER BY id", [workoutId, userId], function(error, results) {
            if (error) {
                console.log("DEBUG: workout.model.js :: getWorkoutScoresById() ::", error.message);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function insertWorkout(workout) {
    return new Promise((resolve, reject) => {
        database.db.run("INSERT INTO table_workout(userId, name, description, datetime) VALUES (?, ?, ?, ?)", [workout.userId, workout.name, workout.description, workout.datetime], function(error) {
            if (error) {
                console.log("DEBUG: workout.model.js :: insertWorkout() ::", error.message);
                reject(error);
            } else {
                database.db.get("SELECT last_insert_rowid() from table_workout WHERE userId = ? LIMIT 1", [workout.userId], (error, result) => {
                    if (error) {
                        console.log("DEBUG: workout.model.js :: insertWorkout() ::", error.message);
                        reject(error);
                    } else {
                        if(result != null) {
                            resolve(result["last_insert_rowid()"]);
                        } else {
                            reject(new Error("An unexpected error has occurred"));
                        }
                    }
                });
            }
        });
    });
}

function updateWorkout(workout) {
    return new Promise((resolve, reject) => {
        database.db.run("UPDATE table_workout SET name = ?, description = ?, datetime = ? WHERE id = ? AND userId = ?", [workout.name, workout.description, workout.datetime, workout.id, workout.userId], function(error) {
            if (error) {
                console.log("DEBUG: workout.model.js :: updateWorkout() ::", error.message);
                reject(error);
            } else {
                if(this.changes > 0) {
                    resolve(workout.id);
                } else {
                    reject(new Error("No workout found with the id"));
                }
            }
        });
    });
}

module.exports = {
    getWorkouts,
    getWorkoutById,
    getWorkoutScoresById,
    insertWorkout,
    updateWorkout,
};
