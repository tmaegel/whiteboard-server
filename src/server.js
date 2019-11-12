const https = require('https');
const fs = require('fs');
const sqlite3 = require("sqlite3").verbose();

// Exporting objects
var Database = require("./sqlite");

// Initialize database
let initDatabase;
let port, database, certFile, KeyFile;

// Check this first
try {
    stats = fs.lstatSync("./config.json");
} catch(e) {
    console.log("ERROR: Failed to access to file 'config.json'.");
    process.exit(1);
}

const app = require("./app");

function print_help() {
    console.log("\nRequired arguments");
    console.log("\t--help\t\t\t\t\t\tShow this help.");
    console.log("\t--port\t\t<port>\t\t\tPort to listen on the host.");
    console.log("\t--database\t<db_file>\t\tPort to listen on the host.");
    console.log("\t--cert\t\t<cert_file>\t\tTells the script to use the speci Check fied server certificate file (SSL).");
    console.log("\t--key\t\t<key_file>\t\tTells the script to use the specified server key file (SSL).");
    console.log("\nThis script expects a configuration file called 'config.json'.");
    console.log("The configuration file (JSON) containing the secret (e.g. {\"secret\":\"yoursecret\"}) to creating the JWT.");
    console.log("\nExamples:\n");
    console.log("Initialize the whiteboard SQlite database and run the REST API.");
    console.log("\tnode server.js --init --port <port> --database <db_file> --cert <cert_file> --key <key_file>\n")
    console.log("Run the whiteboard REST API.");
    console.log("\tnode server.js --port <port> --database <db_file> --cert <cert_file> --key <key_file>\n")
    process.exit(1);
}

// Checks to see if the --help argument is present
if(process.argv.indexOf('--help') > -1) {
    print_help();
}

// Checks to see if the --init argument is present
const initIndex = process.argv.indexOf('--init');
if(initIndex > -1) {
    initDatabase = true;
} else {
    initDatabase = false;
}

// Also checks for --database and if we have a value
const databaseIndex = process.argv.indexOf('--database');
if(databaseIndex > -1) {
    // Grabs the value after --databae
    database = process.argv[databaseIndex + 1];
    if(!database) {
        console.log("ERROR: Missing argument '--database'");
        process.exit(1);
    }
} else {
    console.log("ERROR: Missing option '--database'");
    process.exit(1);
}

// Check existance of database file when init_db = false only
if(!initDatabase) {
    try {
        stats = fs.lstatSync(database);
    } catch(e) {
        console.log("ERROR: Failed to access to database '" + database + "'.");
        process.exit(1);
    }
}

/**
 * Initialize database
 */
exports.database = database;
if (initDatabase) {
    // Open database
    Database.open();
    // Init database
    Database.init();
    // Close Database
    Database.close();
}

/**
 * Execute the following code only if initDatabase = false
 */

// Also checks for --port and if we have a value
const portIndex = process.argv.indexOf('--port');
if(portIndex > -1) {
    // Grabs the value after --port
    port = process.argv[portIndex + 1];
    if(!port) {
        console.log("ERROR: Missing argument '--port'");
        process.exit(1);
    }
} else {
    console.log("ERROR: Missing option '--port'");
    process.exit(1);
}

// Also checks for --cert and if we have a value
const certIndex = process.argv.indexOf('--cert');
if(certIndex > -1) {
    // Grabs the value after --cert
    certFile = process.argv[certIndex + 1];
    if(!certFile) {
        console.log("ERROR: Missing argument '--cert'");
        process.exit(1);
    }
} else {
    console.log("ERROR: Missing option '--cert'");
    process.exit(1);
}

// Also checks for --key and if we have a value
const keyIndex = process.argv.indexOf('--key');
if(keyIndex > -1) {
    // Grabs the value after --key
    keyFile = process.argv[keyIndex + 1];
    if(!keyFile) {
        console.log("ERROR: Missing argument '--key'");
        process.exit(1);
    }
} else {
    console.log("ERROR: Missing option '--key'");
    process.exit(1);
}

try {
    stats = fs.lstatSync(certFile);
    stats = fs.lstatSync(keyFile);
} catch(e) {
    console.log("ERROR: Failed to access to files '" + certFile + "' or '" + keyFile + "'.");
    process.exit(1);
}

/**
 * Starting server
 */
const options = {
    cert: fs.readFileSync(certFile),
    key: fs.readFileSync(keyFile)
};

const server = https.createServer(options, app);
server.on('error', function (e) {
    console.log("ERROR: Something went wrong while listening to port " + port + ".");
    process.exit(1);
});
console.log("Listening to port " + port);
server.listen(port);
