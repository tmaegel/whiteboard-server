const database = require("./sqlite.model.js");

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
