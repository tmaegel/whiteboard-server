const https = require('https');
const fs = require('fs');

// Importing objects
const app = require("./app");
const database = require("./models/sqlite.model.js");
const cmdline = require("./cmdline");

/**
 * Starting server
 */
const options = {
    cert: fs.readFileSync(cmdline.certFile),
    key: fs.readFileSync(cmdline.keyFile)
};

const server = https.createServer(options, app);
server.on('error', function(e) {
    console.log("ERROR: Something went wrong while listening to port " + cmdline.port + ".");
    process.exit(1);
});
server.listen(cmdline.port, () => {
  console.log("Listening to port " + cmdline.port);
});;

process.on('SIGINT', () => {
    database.close();
    server.close();
});
