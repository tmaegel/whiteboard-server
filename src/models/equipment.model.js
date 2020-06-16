/**
 * equipment module
 * @module models/equipment.model
 * @requires models/sqlite.model
 */

const database = require("./sqlite.model.js");

/**
 * Get all equipment.
 * @returns {Promise} Promise object represents a list if all equipment.
 */
function getAll() {
    return new Promise((resolve, reject) => {
        database.db.all("SELECT id, equipment FROM table_equipment ORDER BY id", [], function(error, results) {
            if (error) {
                console.log("DEBUG: equipment.model.js :: getAll() ::", error.message);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = {
    getAll,
};
