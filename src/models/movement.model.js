const database = require("./sqlite.model.js");

function getAll() {
    return new Promise((resolve, reject) => {
        database.db.all("SELECT id, movement, equipmentIds FROM table_movements ORDER BY id", [], function(error, results) {
            if (error) {
                console.log("DEBUG: moveement.model.js :: getAll() ::", error.message);
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
