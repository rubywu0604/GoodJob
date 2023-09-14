const http = require('http');
const mysql = require('mysql');

require('dotenv').config();
const host = process.env.RDS_HOSTNAME;
const port = process.env.RDS_PORT;
const user = process.env.RDS_USERNAME;
const password = process.env.RDS_PASSWORD;
const db = mysql.createConnection({
    host: host,
    port: port,
    user: user,
    password: password
})

function connectToMysql(db) {
    db.connect((err) => {
        if (err) {
            console.log(err.message);
            return;
        };
        console.log("Database connected.");
    });
}

function createDatabase(db) {
    db.query("CREATE DATABASE goodjob", function (err, result) {
        if (err) {
            console.log(err.message);
            return;
        };
        console.log("Database created.");
    });
}

connectToMysql(db)

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello World');
}).listen(8080);