const { default: axios } = require('axios')

const request = async (token, query) => {
    const response = await axios.post(
        'https://api.app.code.berlin/graphql',
        { query: query },
        { headers: { Authorization: token } }
    )
    return response.data.data
}

const getMyStudies = async (token, getProjects=false) => {
    const query = `query {
        myStudies {
            shortCode  # eg SE_36_Fall_2019. We don't need this but I think it's good to have in case we can't work with the semesterModule id later
            assessments {
                assessmentStatus  # present, absent, etc
                assessmentStyle  # standard, alternative, etc
                examinationForms  # oral, written, etc
                proposalText
                grade
                assessmentProtocol
                internalNotes
                externalFeedback
                attempt
                earlyAssessmentProposal
                assessmentType  # normal, reassessment, level up, etc
                ${getProjects ? `project {
                    id
                }` : ''}
                semesterModule {
                    id
                }
            }
        }
    }`
    const data = await request(token, query)
    return data.myStudies
}

const getCurrentSemester = async token => {
    const query = `query {
        mySemesterModules {
            id
        }
    }`
    const data = await request(token, query)
    return data.mySemesterModules
}

const getEvents = async token => {
    const query = `query {
        myEventGroups {
            id
        }
    }`
    const data = await request(token, query)
    return data.myEventGroups
}

const getProjects = async token => {
    const query = `{
        myProjects {
            id
        }
    }`
    const data = await request(token, query)
    return data.myProjects
}

module.exports = {
    getMyStudies,
    getCurrentSemester,
    getEvents,
    getProjects,
}
