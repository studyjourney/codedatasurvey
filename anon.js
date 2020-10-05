const { connection } = require('./db')

async function getNameList() {
    const getNames = await connection.query('SELECT * FROM code_user_names')
    var nameList = []
    for (var i in getNames) {
        nameList.push(getNames[i].name)
    }
    return nameList
}

async function getAssmNotes() {
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
    const userNames = await getNameList()
    const assmNotes = await getAssmNotes()

    // Every set of assessment notes
    for (var x in assmNotes) {
        var usedNames = [];
        for (var i in userNames) {
            if (!assmNotes[x].internal && !assmNotes[x].external) {
                break
            } else if (!assmNotes[x].external) {
                usedNames.pushIfExists(lookForNamesInternal(userNames[i], assmNotes[x].internal))
            } else if (!assmNotes[x].internal) {
                usedNames.pushIfExists(lookForNamesExternal(userNames[i], assmNotes[x].external))
            } else {
                usedNames.pushIfExists(lookForNamesInternal(userNames[i], assmNotes[x].internal))
                usedNames.pushIfExists(lookForNamesExternal(userNames[i], assmNotes[x].external))
            }
        }
        console.log(usedNames)
    }

    // console.log(splitNotes[0])
    // console.log(userNames[0])
    // console.log(assmNotes[0].internal)

}

function lookForNamesInternal(userName, internalNotes) {
    if (internalNotes.toLowerCase().replace(/\n/g, " ").split(" ").includes(userName)) {
        return userName
    }
}


function lookForNamesExternal(userName, externalNotes) {
    if (externalNotes.toLowerCase().replace(/\n/g, " ").split(" ").includes(userName)) {
        return userName
    }
}

// Custom push method that only pushes if the passed item is not null or false
Array.prototype.pushIfExists = function(element) {
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