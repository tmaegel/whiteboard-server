const fs = require('fs');

// Importing objects
const database = require("./models/sqlite.model.js");

let initDatabase,
    configFile,
    config,
    dataFile,
    data,
    port,
    dbFile,
    certFile,
    keyFile;

function print_help() {
    console.log("\nRequired arguments");
    console.log("\t--help\t\t\t\t\t\tShow this help.");
    console.log("\t--port\t\t<port>\t\t\tPort to listen on the host.");
    console.log("\t--database\t<db_file>\t\tPort to listen on the host.");
    console.log("\t--cert\t\t<cert_file>\t\tTells the script to use the specified server certificate file (SSL).");
    console.log("\t--key\t\t<key_file>\t\tTells the script to use the specified server key file (SSL).");
    console.log("\t--config\t<config>\t\tConfig file. The configuration file (JSON) containing the secret (e.g. see example below) to creating the JWT.");
    console.log("\t--init\t\t<data>\t\t\t\Data file. Contains initial data that should be written to the database. (e.g. see example below)");
    console.log("\nExamples:\n");
    console.log("Initialize the whiteboard SQlite database with data contains in data file and run the REST API.");
    console.log("\tnode server.js --init <data> --config <config> --port <port> --database <db_file> --cert <cert_file> --key <key_file>\n")
    console.log("Run the whiteboard REST API.");
    console.log("\tnode server.js --config <config> --port <port> --database <db_file> --cert <cert_file> --key <key_file>\n")
    console.log("Config file");
    console.log("\t{\"secret\":\"yoursecret\"}");
    console.log("\Data file");
    console.log("\t{\"users\":[{\"name\":\"admin\",\"hash\":\"hashedPassword\"},{\"name\":\"user\",\"hash\":\"hashedPassword\"}]}");
    process.exit(1);
}

// Checks to see if the --help argument is present
if(process.argv.indexOf('--help') > -1) {
    print_help();
}

configFile = process.env.WHITEBOARD_CONFIG;
if(!configFile) {
    // Also checks for --config and if we have a value
    const configIndex = process.argv.indexOf('--config');
    if(configIndex > -1) {
        // Grabs the value after --databae
        configFile = process.argv[configIndex + 1];
        if(!configFile) {
            console.log("ERROR: Missing argument '--config'");
            process.exit(1);
        }
    } else {
        console.log("ERROR: Missing option '--config'");
        process.exit(1);
    }
}
try {
    config = JSON.parse(fs.readFileSync(configFile));
} catch(e) {
    console.log("ERROR: Failed to access to config file.");
    process.exit(1);
}

// Checks to see if the --init argument is present
const initIndex = process.argv.indexOf('--init');
if(initIndex > -1) {
    // Grabs the value after --init
    dataFile = process.argv[initIndex + 1];
    if(!dataFile) {
        console.log("ERROR: Missing argument '--init'");
        process.exit(1);
    }
    initDatabase = true;
    try {
        data = JSON.parse(fs.readFileSync(dataFile));
        console.log(data);
    } catch(e) {
        console.log("ERROR: Failed to access to data file.");
        process.exit(1);
    }
} else {
    initDatabase = false;
}

dbFile = process.env.WHITEBOARD_DB;
if(!dbFile) {
    // Also checks for --database and if we have a value
    const databaseIndex = process.argv.indexOf('--database');
    if(databaseIndex > -1) {
        // Grabs the value after --database
        dbFile = process.argv[databaseIndex + 1];
        if(!dbFile) {
            console.log("ERROR: Missing argument '--database'");
            process.exit(1);
        }
    } else {
        console.log("ERROR: Missing option '--database'");
        process.exit(1);
    }
}
// Check existance of database file when initDatabase = false only
if(!initDatabase) {
    try {
        stats = fs.lstatSync(dbFile);
    } catch(e) {
        console.log("ERROR: Failed to access to database '" + dbFile + "'.");
        process.exit(1);
    }
}

port = process.env.WHITEBOARD_PORT;
if(!port) {
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
}

certFile = process.env.WHITEBOARD_CERT;
if(!certFile) {
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
}

keyFile = process.env.WHITEBOARD_KEY;
if(!keyFile) {
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
}

try {
    stats = fs.lstatSync(certFile);
    stats = fs.lstatSync(keyFile);
} catch(e) {
    console.log("ERROR: Failed to access to files '" + certFile + "' or '" + keyFile + "'.");
    process.exit(1);
}

module.exports = {
    initDatabase,
    config,
    data,
    port,
    dbFile,
    certFile,
    keyFile,
};
