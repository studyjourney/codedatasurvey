const router = require('express').Router();

const db = require('../db');
const con = require('../consolelog');
const { getMyStudies, getCurrentSemester, getEvents, getProjects } = require('../codeLearningPlatform');

//CODE data aquisition API token
router.post('/', async (req, res) => {
    try {
        const { token, permissions } = req.body
        //Query API before creating a new student in the DB in case the token is not valid
        const assessments = await getMyStudies(token, permissions.projects)
        const studentId = await db.newStudent()
        await db.writeAssessments(studentId, assessments)
        if (permissions.currentSemester) await db.writeCurrentSemester(studentId, await getCurrentSemester(token))
        if (permissions.events) await db.writeEvents(studentId, await getEvents(token))
        if (permissions.projects) await db.writeProjects(studentId, await getProjects(token))
        res.send('ok')
    } catch (err) {
        console.log(con.err, err)
        res.status(500).send('error')
    }
});

module.exports = router;