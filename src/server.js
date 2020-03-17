const http = require('http');
const https = require('https');
const fs = require('fs');

// Importing objects
const app = require("./app");
const database = require("./models/sqlite.model.js");
const cmdline = require("./cmdline");

/**
 * Starting server
 */
let server;
if(cmdline.useHttps) {
    console.log("INFO: Using secure https mode.");
    const options = {
        cert: fs.readFileSync(cmdline.certFile),
        key: fs.readFileSync(cmdline.keyFile)
    };

    server = https.createServer(options, app);
    server.on('error', function(e) {
        console.log("ERROR: Something went wrong while listening to port " + cmdline.port + ".");
        process.exit(1);
    });
} else {
    console.log("INFO: Using insecure http mode.");
    server = http.createServer(app);
    server.on('error', function(e) {
        console.log("ERROR: Something went wrong while listening to port " + cmdline.port + ".");
        process.exit(1);
    });
}
server.listen(cmdline.port, () => {
  console.log("Listening to port " + cmdline.port);
});;

process.on('SIGINT', () => {
    database.close();
    server.close();
});
