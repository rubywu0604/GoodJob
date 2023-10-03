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
            res.setHeader('Content-Type', 'application/json');
            const formattedResponse = JSON.stringify(results, null, 2);
            res.send(formattedResponse);
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

            if (req.query.page) {
                const page = parseInt(req.query.page);
                const limit = parseInt(req.query.limit || 20);

                const startIndex = (page - 1) * limit;
                const endIndex = page * limit;

                const categoryJobs = {};

                if (startIndex > 0) {
                    categoryJobs.previous = {
                        page: page - 1,
                        limit: limit
                    }
                }
                if (endIndex < results.length) {
                    categoryJobs.next = {
                        page: page + 1,
                        limit: limit
                    }
                }
                categoryJobs.selectedPage = page;
                categoryJobs.jobs = results.slice(startIndex, endIndex);

                const formattedResponse = JSON.stringify(categoryJobs, null, 2);
                res.send(formattedResponse);
            } else {
                const formattedResponse = JSON.stringify(results, null, 2);
                res.send(formattedResponse);
            }
        }
    });
});

app.listen(port, () => {
    console.log(`listen on the port ${port}`);
});