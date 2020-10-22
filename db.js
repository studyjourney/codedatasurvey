const util = require('util');
const mysql = require('mysql');
const con = require('./consolelog');
require('dotenv').config();

var db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

const connection = mysql.createConnection(db_config);

const newStudent = async () => {
    const { insertId: studentId } = await connection.connect((err) => {
        if (err) console.error(con.err + err);
        else return connection.query('INSERT INTO students () values ();')
    })
    return studentId
}

const writeAssessments = async (studentId, assessments) => {
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
    const assessmentsValues = assessments.map(assessment => {
        // I am not completely sure of the type of assessment.examinationForms
        // but I think it could still be pretty vaulable information to have
        // so that's why I'm doing this. I think it's an array.
        const examinationForms = Array.isArray(assessment.examinationForms) ?
            assessment.examinationForms.length ? assessment.examinationForms : null :
            JSON.stringify(assessment.examinationForms)
        return [
            studentId,
            assessment.shortCode,
            assessment.assessmentStatus,
            assessment.assessmentStyle,
            examinationForms,
            assessment.proposalText,
            assessment.grade,
            assessment.assessmentProtocol,
            assessment.internalNotes,
            assessment.externalFeedback,
            assessment.attempt,
            assessment.earlyAssessmentProposal,
            assessment.assessmentType,
            assessment.project?.id,
            assessment.semesterModule?.id,
        ]
    })
    const result = await connection.connect(async (err) => {
        if (err) console.error(con.err + err);
        else return await connection.query(assessmentsSql, [assessmentsValues]);
    })
    return result
}

const writeCurrentSemester = async (studentId, mySemesterModules) => {
    if (!mySemesterModules.length) return
    const currentSemesterSql = `INSERT INTO fs20_modules(
        student_id,
        semester_module_lp_id
    ) VALUES ?;`
    const currentSemesterValues = mySemesterModules.map(module => [studentId, module.id])
    const result = await connection.connect(async (err) => {
        if (err) console.error(con.err + err);
        else return await connection.query(currentSemesterSql, [currentSemesterValues]);
    })
    return result
}

const writeEvents = async (studentId, myEventGroups) => {
    if (!myEventGroups.length) return
    const eventsSql = `INSERT INTO students_event_groups(
        student_id,
        event_group_lp_id
    ) VALUES ?`
    const eventsValues = myEventGroups.map(event => [studentId, event.id])
    const result = await connection.connect(async (err) => {
        if (err) console.error(con.err + err);
        else return await connection.query(eventsSql, [eventsValues])
    })
    return result
}

const writeProjects = async (studentId, myProjects) => {
    if (!myProjects.length) return
    const projectSql = `INSERT INTO students_projects(
        student_id,
        project_lp_id
    ) VALUES ?`
    const projectsValues = myProjects.map(project => [studentId, project.id])
    const result = await connection.connect(async (err) => {
        if (err) console.error(con.err + err);
        else return await connection.query(projectSql, [projectsValues])
    })
    return result
}

module.exports = {
    connection,
    newStudent,
    writeAssessments,
    writeCurrentSemester,
    writeEvents,
    writeProjects,
}
