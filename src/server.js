const https = require('https');
const fs = require('fs');
const app = require("./app");

let args = process.argv.slice(2);
if(args.length != 3) {
    console.log("ERROR: Too many or too less arguments passed.");
    console.log("\nRequired arguments");
    console.log("\t<PORT>\t\tPort to listen on the host.");
    console.log("\t<CERT>\t\tTells the script to use the specified server certificate file when listening on the server port.");
    console.log("\t<KEY>\t\tTells the script to use the specified server key file when listening on the server port.");
    console.log("\nThis script expects a configuration file called 'config.json'.");
    console.log("The configuration file (JSON) containing the secret (e.g. {\"secret\":\"yoursecret\"}) to creating the JWT.");
    console.log("\nnode server.js <PORT> <CERT> <KEY>\n")
    process.exit(1);
}

try {
    stats = fs.lstatSync(args[1]);
    stats = fs.lstatSync(args[2]);
} catch(e) {
    console.log("ERROR: Failed to access to files '" + args[1] + "' or '" + args[2] + "'.");
    process.exit(1);
}

// This script expects a config file called 'secret.json'
fs.access("./config.json", (err, stats) => {
    if(err) {
        console.log("ERROR: Failed to access to file 'config.json'.");
        process.exit(1);
    }

    const port = process.env.PORT || args[0];

    const options = {
        cert: fs.readFileSync(args[1]),
        key: fs.readFileSync(args[2])
    };

    const server = https.createServer(options, app);
    server.on('error', function (e) {
        console.log("ERROR: Something went wrong while listening to port " + port + ".");
        process.exit(1);
    });
    server.listen(port);
});
