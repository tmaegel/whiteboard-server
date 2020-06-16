/**
 * score module
 * @module models/score.model
 * @requires models/sqlite.model
 */

const database = require("./sqlite.model.js");

/**
 * Get all scores with user id with userId.
 * @param {integer} userId - The user id of the score.
 * @returns {Promise} Promise object represents a list if all scores.
 */
function getScores(userId) {
    return new Promise((resolve, reject) => {
        database.db.all("SELECT id, userId, workoutId, score, rx, datetime, note FROM table_workout_score WHERE userId = ? ORDER BY id", [userId], function(error, results) {
            if (error) {
                console.log("DEBUG: score.model.js :: getScores() ::", error.message);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * Get the score with id and user id with userId.
 * @param {integer} userId - The user id of the score.
 * @param {integer} scoreId - The id of the score.
 * @returns {Promise} Promise object represents the score object.
 */
function getScoreById(userId, scoreId) {
    return new Promise((resolve, reject) => {
        database.db.get("SELECT id, userId, workoutId, score, rx, datetime, note FROM table_workout_score WHERE id = ? AND userId = ?", [scoreId, userId], function(error, result) {
            if (error) {
                console.log("DEBUG: score.model.js :: getScoreById() ::", error.message);
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

/**
 * Insert a new representation of workout score in the database.
 * @param {Object} score - The score object that is update in the database.
 * @param {integer} score.userId - The user id of the score.
 * @param {integer} score.workoutId - The workout id of the score.
 * @param {string} score.score - The score value of the score.
 * @param {boolean} score.rx - The rx value of the score.
 * @param {integer} score.timestamp - The timestamp of the score.
 * @param {string} score.note - The note of the score.
 * @returns {Promise} Promise object represents the score id of the inserted score.
 */
function insertScore(score) {
    return new Promise((resolve, reject) => {
        database.db.run("INSERT INTO table_workout_score(userId, workoutId, score, rx, datetime, note) VALUES (?, ?, ?, ?, ?, ?)", [score.userId, score.workoutId, score.score, score.rx, score.datetime, score.note], function(error) {
            if (error) {
                console.log("DEBUG: score.model.js :: insertScore() ::", error.message);
                reject(error);
            } else {
                database.db.get("SELECT last_insert_rowid() from table_workout_score WHERE userId = ? LIMIT 1", [score.userId], (error, result) => {
                    if (error) {
                        console.log("DEBUG: score.model.js :: insertScore() ::", error.message);
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
 * Update the representation of workout score in the database.
 * @param {Object} score - The score object that is update in the database.
 * @param {integer} score.id - The id of the score.
 * @param {integer} score.userId - The user id of the score.
 * @param {integer} score.workoutId - The workout id of the score.
 * @param {string} score.score - The score value of the score.
 * @param {boolean} score.rx - The rx value of the score.
 * @param {integer} score.timestamp - The timestamp of the score.
 * @param {string} score.note - The note of the score.
 * @returns {Promise} Promise object represents the score id of the updated score.
 */
function updateScore(score) {
    return new Promise((resolve, reject) => {
        database.db.run("UPDATE table_workout_score SET workoutId = ?, score = ?, rx = ?, datetime = ?, note = ? WHERE id = ? and userId = ?", [score.workoutId, score.score, score.rx, score.datetime, score.note, score.id, score.userId], function(error) {
            if (error) {
                console.log("DEBUG: score.model.js :: updateScore() ::", error.message);
                reject(error);
            } else {
                if(this.changes > 0) {
                    resolve(score.id);
                } else {
                    reject(new Error("No score found with the id"));
                }
            }
        });
    });
}

module.exports = {
    getScores,
    getScoreById,
    insertScore,
    updateScore,
};
