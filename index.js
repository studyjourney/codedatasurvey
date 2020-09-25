const express = require('express');
mysql = require('mysql');

require('dotenv').config();

//Custom Modules
const con = require('./consolelog');
const db = require('./db');
const { getMyStudies, getCurrentSemester, getEvents, getProjects } = require('./codeLearningPlatform');

const app = express();
app.set('view engine', 'ejs');
app.use(express.json())

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

//CODE data aquisition API token
app.post('/codeData', async (req, res) => {
    try {
        const { token, permissions } = req.body
        const studentId = await db.newStudent()
        await db.writeAssessments(studentId, await getMyStudies(token, permissions.projects))
        if (permissions.currentSemester) await db.writeCurrentSemester(studentId, await getCurrentSemester(token))
        if (permissions.events) await db.writeEvents(studentId, await getEvents(token))
        if (permissions.projects) await db.writeProjects(studentId, await getProjects(token))
        res.send('ok')
    } catch (err) {
        console.log(con.err, err)
        res.status(500).send('error')
    }
})

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
