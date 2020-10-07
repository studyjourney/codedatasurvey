const { connection } = require('./db')

async function getNameList() {
    const getNames = await connection.query('SELECT * FROM code_user_names')
    var nameList = []
    for (var i in getNames) {
        nameList.push(getNames[i].name)
    }
    return nameList
}

async function getAssessmentNotes() {
    const getNotes = await connection.query('SELECT external_notes, internal_notes FROM assessments')
    var notesList = []
    for (var i in getNotes) {
        notesList.push({
            internal: getNotes[i].internal_notes,
            external: getNotes[i].external_notes
        })
    }
    return notesList
}



async function replaceNewNames() {
}

// Retroactively fix all non-censored names in the database. (03.10.2020)
async function replaceExistingNames() {
    const userNameList = await getNameList()
    const assessmentNoteList = await getAssessmentNotes()

    // Every set of assessment notes in db
    for (var x in assessmentNoteList) {
        var assessmentNotes = assessmentNoteList[x]

        var usedNames = listNamesInText(assessmentNotes, userNameList);
        var fixedInternalNotes = assessmentNotes.internal
        var fixedExternalNotes = assessmentNotes.external
        for (var i in usedNames) {
            var replaceWord = `Person${+i + +1}`
            var regExpName = new RegExp('(' + usedNames[i] + ')', 'gi')
            // I feel like this can be cleaner
            if (!assessmentNotes.internal && !assessmentNotes.external) {
            } else if (!assessmentNotes.external) {
                fixedInternalNotes = fixedInternalNotes.replace(regExpName, replaceWord)
            } else if (!assessmentNotes.internal) {
                fixedExternalNotes = fixedExternalNotes.replace(regExpName, replaceWord)
            } else {
                fixedInternalNotes = fixedInternalNotes.replace(regExpName, replaceWord)
                fixedExternalNotes = fixedExternalNotes.replace(regExpName, replaceWord)
            }
        }
        assessmentNotes.internal = fixedInternalNotes
        assessmentNotes.external = fixedExternalNotes
    }
    return assessmentNoteList
}

// References list of usernames against the notes and returns a list of all ocurring names
function listNamesInText(assessmentNotes, userNameList) {
    var usedNames = [];

    for (var i in userNameList) {
        if (!assessmentNotes.internal && !assessmentNotes.external) {
            return []
        } else if (!assessmentNotes.external) {
            usedNames.pushIfExists(lookForNames(userNameList[i], assessmentNotes.internal))
        } else if (!assessmentNotes.internal) {
            usedNames.pushIfExists(lookForNames(userNameList[i], assessmentNotes.external))
        } else {
            usedNames.pushIfExists(lookForNames(userNameList[i], assessmentNotes.internal))
            usedNames.pushIfExists(lookForNames(userNameList[i], assessmentNotes.external))
        }
    }
    return usedNames
}

function lookForNames(userName, notes) {
    if (notes.toLowerCase().replace(/\n/g, " ").split(" ").includes(userName)) {
        return userName
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

module.exports = {
    replaceNewNames,
    replaceExistingNames
};