/**
 * tag module
 * @module models/tag.model
 * @requires models/sqlite.model
 */

const database = require("./sqlite.model.js");

/**
 * Get all tags with user id userId or 1.
 * @returns {Promise} Promise object represents a list if all equipment.
 */
function getAll(userId) {
    return new Promise((resolve, reject) => {
        database.db.all("SELECT id, userId, tag FROM table_tags WHERE userId = 1 OR userId = ? ORDER BY id", [userId], function(error, results) {
            if (error) {
                console.log("DEBUG: tag.model.js :: getAll() ::", error.message);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * Get the tag with id and with user id userId or 1.
 * @param {integer} userId - The user id of the tag.
 * @param {integer} tagId - The id of the tag.
 * @returns {Promise} Promise object represents the tag object.
 */
function getTagById(userId, tagId) {
    return new Promise((resolve, reject) => {
        database.db.get("SELECT id, userId, tag FROM table_tags WHERE id = ? AND (userId = 1 OR userId = ?)", [tagId, userId], function(error, result) {
            if (error) {
                console.log("DEBUG: tag.model.js :: getTagById() ::", error.message);
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

/**
 * Insert a new representation of tag in the database.
 * @param {Object} tag - The tag object that is insert in the database.
 * @param {integer} tag.userId - The user id of the tag.
 * @param {string} tag.name - The name of the tag.
 * @returns {Promise} Promise object represents the tag id of the inserted tag.
 */
function insertTag(tag) {
    return new Promise((resolve, reject) => {
        database.db.run("INSERT INTO table_tags(userId, tag) VALUES (?, ?)", [tag.userId, tag.tag], function(error) {
            if (error) {
                console.log("DEBUG: tag.model.js :: insertTag() ::", error.message);
                reject(error);
            } else {
                // @todo: its not atomic?
                database.db.get("SELECT last_insert_rowid() from table_tags WHERE userId = ? LIMIT 1", [tag.userId], (error, result) => {
                    if (error) {
                        console.log("DEBUG: tag.model.js :: insertTag() ::", error.message);
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
 * Update the representation of tag in the database.
 * @param {Object} tag - The tag object that is update in the database.
 * @param {integer} tag.id - The id of the tag.
 * @param {integer} tag.userId - The user id of the tag.
 * @param {string} tag.name - The name of the tag.
 * @returns {Promise} Promise object represents the tag id of the updated tag.
 */
function updateTag(tag) {
    return new Promise((resolve, reject) => {
        database.db.run("UPDATE table_tags SET tag = ? WHERE id = ? AND userId = ?", [tag.tag, tag.id, tag.userId], function(error) {
            if (error) {
                console.log("DEBUG: tag.model.js :: updateTag() ::", error.message);
                reject(error);
            } else {
                if(this.changes > 0) {
                    resolve(tag.id);
                } else {
                    reject(new Error("No tag found with the id"));
                }
            }
        });
    });
}

module.exports = {
    getAll,
    getTagById,
    insertTag,
    updateTag,
};
