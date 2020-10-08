const { connection } = require('./db')

async function getNameList() {
    const dbNames = await connection.query('SELECT * FROM code_user_names')
    let nameList = dbNames.map(dbName => dbName.name)
    return nameList
}

async function getExistingAssessmentNotes() {
    const dbNotes = await connection.query('SELECT external_notes, internal_notes FROM assessments')
    let notesList = dbNotes.map(dbNote => ({
        internal: dbNote.internal_notes,
        external: dbNote.external_notes
    }))
    return notesList
}


// Returns anonymized Assessment Notes
async function notesAnonymizer(userAssessmentList) {
    const userNameList = await getNameList()
    let reservedIDs = {}

    for (let userAssessment of userAssessmentList) {
        const assessmentNotes = {
            internal: userAssessment.internalNotes,
            external: userAssessment.externalFeedback
        }

        const anonymizedNotes = replaceNamesInNotes(assessmentNotes, userNameList, reservedIDs)
        userAssessment.internalNotes = anonymizedNotes.assessmentNotes.internal
        userAssessment.externalFeedback = anonymizedNotes.assessmentNotes.external

        reservedIDs = Object.assign({}, reservedIDs, anonymizedNotes.reservedIDs)

    }
    return userAssessmentList
}

// Retroactively anonymize all non-censored names in the database.
async function retroactiveNotesAnonymizer() {
    const userNameList = await getNameList()
    const assessmentNoteList = await getExistingAssessmentNotes()
    let reservedIDs = {}

    // Every set of assessment notes in db
    for (let assessmentNotes of assessmentNoteList) {
        const anonymizedNotes = replaceNamesInNotes(assessmentNotes, userNameList, reservedIDs)
        assessmentNotes = anonymizedNotes.assessmentNotes
        reservedIDs = Object.assign({}, reservedIDs, anonymizedNotes.reservedIDs)
    }
    return assessmentNoteList
}

function replaceNamesInNotes(assessmentNotes, userNameList, reservedIDs) {
    let usedNamesList = listNamesInText(assessmentNotes, userNameList);
    let anonymizedInternalNotes = assessmentNotes.internal
    let anonymizedExternalNotes = assessmentNotes.external

    // Also do some other time.
    // if (isFullName(anonymizedInternalNotes, usedNamesList)) {
    // }

    for (const usedNameDict of usedNamesList) {
        usedName = usedNameDict.name
        let replaceWord;

        if (reservedIDs.hasOwnProperty(usedName)) {
            replaceWord = 'Person' + reservedIDs[usedName]
        }
        else {
            let userID = Math.floor(Math.random() * 100) + 1
            while (Object.keys(reservedIDs).some((key) => { return reservedIDs[key] === userID; })) {
                userID = Math.floor(Math.random() * 100) + 1
            }
            reservedIDs[usedName] = userID
            replaceWord = 'Person' + userID
        }
        const regExpName = new RegExp("\\b" + usedName + "\\b", "gi")

        // I feel like this can be cleaner (switch)
        if (!anonymizedInternalNotes && !anonymizedExternalNotes) {
        } else if (!anonymizedExternalNotes) {
            anonymizedInternalNotes = anonymizedInternalNotes.replace(regExpName, replaceWord)
        } else if (!anonymizedInternalNotes) {
            fixedExternalNotes = anonymizedExternalNotes.replace(regExpName, replaceWord)
        } else {
            anonymizedInternalNotes = anonymizedInternalNotes.replace(regExpName, replaceWord)
            anonymizedExternalNotes = anonymizedExternalNotes.replace(regExpName, replaceWord)
        }
    }
    assessmentNotes.internal = anonymizedInternalNotes
    assessmentNotes.external = anonymizedExternalNotes

    return {assessmentNotes: assessmentNotes, reservedIDs: reservedIDs}
}

// References list of usernames against the notes and returns a list of all ocurring names
function listNamesInText(assessmentNotes, userNameList) {
    let usedNames = [];

    for (const userName of userNameList) {
        if (!assessmentNotes.internal && !assessmentNotes.external) {
            return []
        } else if (!assessmentNotes.external) {
            usedNames.pushIfExists(lookForNames(userName, assessmentNotes.internal))
        } else if (!assessmentNotes.internal) {
            usedNames.pushIfExists(lookForNames(userName, assessmentNotes.external))
        } else {
            usedNames.pushIfExists(lookForNames(userName, assessmentNotes.internal))
            usedNames.pushIfExists(lookForNames(userName, assessmentNotes.external))
        }
    }
    return usedNames
}

function lookForNames(userName, notes) {
    let notesAsWordList = notes.toLowerCase().replace(".", " ").replace(",", " ").replace(/\n/g, " ").split(" ")

    if (notesAsWordList.includes(userName)) {
        return { name: userName, indexInStr: notes.toLowerCase().indexOf(userName), indexInArr: notesAsWordList.indexOf(userName) }
    }
}

// Do some other time.
// function isFullName(notes, usedNames) {
//     if (!usedNames.lenght) {}
//     console.log(usedNames);
//     usedNames.indexInArr.sort(a,b => console.log(a, b))
// }

// Custom push method that only pushes if the passed item is not null or false
Array.prototype.pushIfExists = function (element) {
    if (element) {
        this.push(element)
        return true;
    }
    return false;
}
Object.defineProperty(Array.prototype, 'pushIfExists', {
    enumerable: false
});

module.exports = {
    notesAnonymizer,
    retroactiveNotesAnonymizer
};