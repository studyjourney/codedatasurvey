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


// maybe other names would be smarter
// Returns anonymized Assessment Notes
async function notesAnonymizer(internalNotes, externalNotes) {
    const userNameList = await getNameList()
    let assessmentNotes = {
        internal: internalNotes,
        external: externalNotes
    }
    return replaceNamesInNotes(assessmentNotes, userNameList)
}

// maybe other names would be smarter
// Retroactively anonymize all non-censored names in the database.
async function retroactiveNotesAnonymizer() {
    const userNameList = await getNameList()
    const assessmentNoteList = await getExistingAssessmentNotes()

    // Every set of assessment notes in db
    for (let assessmentNotes of assessmentNoteList) {
        assessmentNotes = replaceNamesInNotes(assessmentNotes, userNameList)
    }
    return assessmentNoteList
}

function replaceNamesInNotes(assessmentNotes, userNameList) {
    let usedNamesList = listNamesInText(assessmentNotes, userNameList);
    let anonymizedInternalNotes = assessmentNotes.internal
    let anonymizedExternalNotes = assessmentNotes.external



    for (const usedName of usedNamesList) {
        const replaceWord = `Person${+usedNamesList.indexOf(usedName) + +1}`
        const regExpName = new RegExp('(' + usedName.name + ')', 'gi')
        // I feel like this can be cleaner (case)
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

    return assessmentNotes
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
        return {name: userName, indexInStr: notes.toLowerCase().indexOf(userName), indexInArr: notesAsWordList.indexOf(userName)}
    }
}


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