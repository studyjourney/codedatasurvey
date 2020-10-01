const util = require( 'util' );
const mysql = require('mysql');
const { NameAnonymizer } = require('./anonymization');
require('dotenv').config();

const mysqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// mysql.Connection methods accept callback functions rather than returning promises
// which makes it inconvenient to work with them in modern JavaScript development
// unless you "promisify" the methods you want to use first.
const connection = {
    query: util.promisify(mysqlConnection.query).bind(mysqlConnection),
    ping: util.promisify(mysqlConnection.ping).bind(mysqlConnection),
}

const newStudent = async () => {
    const { insertId: studentId } = await connection.query('INSERT INTO students () values ();')
    return studentId
}

const writeAssessments = async (studentId, myStudies) => {
    const assessmentsSql = `INSERT INTO assessments(
        student_id,
        module_short_code,
        status,
        style,
        examination_forms,
        proposal,
        grade,
        protocol,
        internal_notes,
        external_notes,
        attempt,
        early_assessment_proposal,
        assessment_type,
        project_lp_id,
        semester_module_lp_id
    ) VALUES ?;`
    const assessmentsValues = []
    const anonymizer = new NameAnonymizer(await getNames())
    for (const module of myStudies) {
        const { shortCode, assessments } = module
        for (const assessment of assessments) {
            // I am not completely sure of the type of assessment.examinationForms
            // but I think it could still be pretty vaulable information to have
            // so that's why I'm doing this. I think it's an array.
            const examinationForms = Array.isArray(assessment.examinationForms) ?
                assessment.examinationForms.length ? assessment.examinationForms : null :
                JSON.stringify(assessment.examinationForms)
            assessmentsValues.push([
                studentId,
                shortCode,
                assessment.assessmentStatus,
                assessment.assessmentStyle,
                examinationForms,
                assessment.proposalText,
                assessment.grade,
                assessment.assessmentProtocol,
                anonymizer.anonymizeAllNamesInText(assessment.internalNotes),
                anonymizer.anonymizeAllNamesInText(assessment.externalFeedback),
                assessment.attempt,
                assessment.earlyAssessmentProposal,
                assessment.assessmentType,
                assessment.project?.id,
                assessment.semesterModule?.id,
            ])
        }
    }
    if (assessmentsValues.length) return await connection.query(assessmentsSql, [assessmentsValues])
}

const writeCurrentSemester = (studentId, mySemesterModules) => {
    if (!mySemesterModules.length) return
    const currentSemesterSql = `INSERT INTO fs20_modules(
        student_id,
        semester_module_lp_id
    ) VALUES ?;`
    const currentSemesterValues = mySemesterModules.map(module => [studentId, module.id])
    return connection.query(currentSemesterSql, [currentSemesterValues])
}

const writeEvents = (studentId, myEventGroups) => {
    if (!myEventGroups.length) return
    const eventsSql = `INSERT INTO students_event_groups(
        student_id,
        event_group_lp_id
    ) VALUES ?`
    const eventsValues = myEventGroups.map(event => [studentId, event.id])
    return connection.query(eventsSql, [eventsValues])
}

const writeProjects = (studentId, myProjects) => {
    if (!myProjects.length) return
    const projectSql = `INSERT INTO students_projects(
        student_id,
        project_lp_id
    ) VALUES ?`
    const projectsValues = myProjects.map(project => [studentId, project.id])
    return connection.query(projectSql, [projectsValues])
}

const getNames = async () => {
    const sql = 'SELECT * FROM code_user_names'
    const rows = await connection.query(sql)
    return rows.map(row => row.name)
}

module.exports = {
    connection,
    newStudent,
    writeAssessments,
    writeCurrentSemester,
    writeEvents,
    writeProjects,
}
