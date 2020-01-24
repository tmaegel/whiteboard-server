const database = require("./sqlite.model.js");

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
