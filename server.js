// ================= node package / middleware =================
const db = require('./database.js')
const express = require("express");
const app = express();
const path = require('path');
const port = 8080;

app.use(express.static(path.join(__dirname, 'public')));

// ================= API routes =================

app.get('/', (req, res) => {
    res.render('index');
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