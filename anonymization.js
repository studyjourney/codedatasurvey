const { connection } = require('./db')

async function getNameList() {
    const dbNames = await connection.query('SELECT * FROM code_user_names')
    let nameList = dbNames.map(dbName => dbName.name)
    return nameList
}

// Returns anonymized Assessment Notes
async function anonymize(userAssessmentList) {
    const userNameList = await getNameList()
    let reservedIDs = {};

    for (let userAssessment of userAssessmentList) {
        let internalNotes = userAssessment.internalNotes.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        let externalFeedback = userAssessment.externalFeedback.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

        if (!!userAssessment.internalNotes) {
            internalNotes = replaceNamesInNotes(internalNotes, userNameList, reservedIDs);
            userAssessment.internalNotes = internalNotes.assessmentNotes;
            reservedIDs = Object.assign({}, reservedIDs, internalNotes.reservedIDs);
        }
        if (!!userAssessment.externalFeedback) {
            externalFeedback = replaceNamesInNotes(externalFeedback, userNameList,reservedIDs);
            userAssessment.externalFeedback = externalFeedback.assessmentNotes;
            reservedIDs = Object.assign({}, reservedIDs, internalNotes.reservedIDs);
        }
    }
    return userAssessmentList;
}

function replaceNamesInNotes(assessmentNotes, userNameList, reservedIDs) {
    let usedNamesList = listNamesInText(assessmentNotes, userNameList);

    for (const usedName of usedNamesList) {
        let replaceWord;

        if (reservedIDs.hasOwnProperty(usedName)) {
            replaceWord = 'Person' + reservedIDs[usedName];
        } else {
            let userID = Math.floor(Math.random() * 100) + 1;
            while (
                Object.keys(reservedIDs).some((key) => {
                    return reservedIDs[key] === userID;
                })
            ) {
                userID = Math.floor(Math.random() * 100) + 1;
            }
            reservedIDs[usedName] = userID;
            replaceWord = 'Person' + userID;
        }

        const regExpName = new RegExp('\\b' + usedName + '\\b', 'gi');
        // I feel like this can be cleaner (switch)
        assessmentNotes = assessmentNotes.replace(regExpName, replaceWord);
    }
    return { assessmentNotes: assessmentNotes, reservedIDs: reservedIDs };
}

// References list of usernames against the notes and returns a list of all ocurring names
function listNamesInText(assessmentNotes, userNameList) {
    let usedNames = [];
    for (const userName of userNameList) {
        usedNames.push(lookForNames(userName, assessmentNotes));
    }
    return usedNames;
}

function lookForNames(userName, notes) {
    let notesAsWordList = notes.toLowerCase().replace('.', ' ').replace(',', ' ').replace(/\n/g, ' ').split(' ');
    if (notesAsWordList.includes(userName)) {
        return userName;
    }
}

module.exports = anonymize
