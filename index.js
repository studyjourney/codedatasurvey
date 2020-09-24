const express = require('express');
mysql = require('mysql');

require('dotenv').config();

//Custom Modules
const con = require('./consolelog');
db = require('./db');

const app = express();
app.set('view engine', 'ejs');

/*
*   Route Handlers
*/
app.use('/', express.static('static'));

app.get("/", function (req, res) {
    res.render('index');
});

//To Provide Docker with a Heartbeat, we respond to ping
app.get('/ping', function (req, res) {
    res.status(200).send("pong");
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
    res.status(404).render('error');
});

//Listen on Config Port
app.listen(process.env.PORT, function () {
    console.log('\033c')
    console.log(con.wlc);
    console.log(con.info + `Listening on port ${process.env.PORT}`);
});

//Make sure the app continues on errors
process.on('uncaughtException', function (err) {
    console.log(con.err + err);
});
