require('dotenv').config(); 
const mysql = require('mysql');

const db_host = process.env.RDS_HOSTNAME;
const db_port = process.env.RDS_PORT;
const db_user = process.env.RDS_USERNAME;
const db_password = process.env.RDS_PASSWORD;
const db_database = process.env.RDS_DATABASE;

const db = mysql.createConnection({
    host: db_host,
    port: db_port,
    user: db_user,
    password: db_password,
    database: db_database
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
module.exports = db