const db = require('../models/database')

const routeController = {
    getpage: (req, res) => {
        res.render('index');
    },
    getAll: (req, res) => {
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
    },
    get: (req, res) => {
        const category = req.params.category;
        const query = 'SELECT * FROM job WHERE category = ?';
        db.query(query, [category], (err, results) => {
            if (err) {
                console.log(err.message);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.setHeader('Content-Type', 'application/json');
                const formattedResponse = JSON.stringify(results, null, 2);
                res.send(formattedResponse);
            }
        });
    }
};

module.exports = routeController;