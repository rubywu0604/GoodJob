const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;

const path = require('path');
app.set('view engine', 'ejs');

const db = require('./models/database');
const routeController = require('./controllers/routeController');

app.get('/', routeController.getpage);
app.get('/api/jobs', routeController.getAll);
app.get('/api/jobs/:category', routeController.get);

app.listen(port, () => {
    db.connect();
    console.log(`Listening on port ${port}.`);
});

module.exports = app;