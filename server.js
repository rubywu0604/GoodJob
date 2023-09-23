// ================= node package / middleware =================
require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');
const port = 8080;
const mysql = require('mysql');

// ======================== Database ========================
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

// ================= API routes =================
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile('index.html');
})

app.get('/api/jobs', (req, res) => {
    db.query('SELECT * FROM job', (err, results) => {
        if (err) {
            console.log(err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
});

app.get(`/api/jobs/:category`, (req, res) => {
    const category = req.params.category;
    const query = 'SELECT * FROM job WHERE category = ?';
    db.query(query, [category], (err, results) => {
        if (err) {
            console.log(err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.json(results);
        }
    });
});

app.listen(port, () => {
    console.log(`listen on the port ${port}`);
});