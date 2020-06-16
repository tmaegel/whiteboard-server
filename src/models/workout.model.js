/**
 * workout module
 * @module models/workout.model
 * @requires models/sqlite.model
 */

const database = require("./sqlite.model.js");

/**
 * Get all workouts with user id userId or 1.
 * @param {integer} userId - The user id of workouts.
 * @returns {Promise} Promise object represents a list if all workouts.
 */
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

/**
 * Get the workout with id and with user id userId or 1.
 * @param {integer} userId - The user id of the workouts.
 * @param {integer} workoutId - The id of the workout.
 * @returns {Promise} Promise object represents the workout object.
 */
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

/**
 * Get the workout scores of the workout with id and userId.
 * @param {integer} userId - The user id of the workouts.
 * @param {integer} workoutId - The id of the workout.
 * @returns {Promise} Promise object represents the workout score object.
 */
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

/**
 * Insert a new representation of workout in the database.
 * @param {Object} workout - The workout object that is insert in the database.
 * @param {integer} workout.userId - The user id of the workout.
 * @param {string} workout.name - The name of the workout.
 * @param {string} workout.description - The description of the workout.
 * @param {integer} workout.timestamp - The timestamp of the last modifiy of the workout.
 * @returns {Promise} Promise object represents the workout id of the inserted workout.
 */
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

/**
 * Update the representation of workout in the database.
 * @param {Object} workout - The workout object that is update in the database.
 * @param {integer} workout.id - The id of the workout.
 * @param {integer} workout.userId - The user id of the workout.
 * @param {string} workout.name - The name of the workout.
 * @param {string} workout.description - The description of the workout.
 * @param {integer} workout.timestamp - The timestamp of the last modifiy of the workout.
 * @returns {Promise} Promise object represents the workout id of the updated workout.
 */
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
