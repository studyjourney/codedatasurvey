const router = require('express').Router();

const db = require('../db');
const con = require('../consolelog');
const { tokenIsValid, getMyStudies, getCurrentSemester, getEvents, getProjects } = require('../codeLearningPlatform');

//CODE data aquisition API token
router.post('/', async (req, res) => {
    try {
        const { token, permissions } = req.body
        if (!await tokenIsValid(token)) return res.status(400).send('invalid token')
        const studentId = await db.newStudent()
        const assessments = await getMyStudies(token, permissions.projects)
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