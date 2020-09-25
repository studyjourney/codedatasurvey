const express = require('express');

// Load config from .env file
require('dotenv').config();

// Custom Modules
const con = require('./consolelog');
const db = require('./db');

const app = express();
app.set('view engine', 'ejs');
app.use(express.json())

// Static Files
app.use('/', express.static('static'));

/*
*   Route Handlers
*/
const indexRouter = require('./routes/index')
const adminRouter = require('./routes/admin')
const pingRouter = require('./routes/ping')
const codeDataRouter = require('./routes/codeData')

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/ping', pingRouter);
app.use('/codeData', codeDataRouter);


//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
    res.status(404).render('error');
});

//Listen on Config Port
app.listen(process.env.PORT, function () {
    console.log('\033c')
    console.log(con.wlc);
    db.connection.ping()
    .then(() => console.log(con.info + 'Connected to the MySQL server'))
    .catch(err => console.error(con.err + err))
    console.log(con.info + `Listening on port ${process.env.PORT}`);
});

//Make sure the app continues on errors
process.on('uncaughtException', function (err) {
    console.log(con.err + err);
});
