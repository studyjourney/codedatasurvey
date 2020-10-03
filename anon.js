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

async function replaceExistingNames() {
    const userNames = await getNameList()
    const assmNotes = await getAssmNotes()
    var usedNames = [];

    for (var x in assmNotes) {
        for (var i in userNames) {
            try {
                if (assmNotes[152].internal.toLowerCase().split(" ").includes(userNames[i]) || assmNotes[152].internal.toLowerCase().split(" ").includes(userNames[i])) {
                    console.log(userNames[i])
                }
            } catch (err) {
                if (!err instanceof TypeError) {
                    console.log(err)
                }
            }
        }
    }

    // var splitNotes = []
    // for (var i in assmNotes) {
    //     var notes = []
    //     try {
    //         notes.push(assmNotes[i].internal.toLowerCase().split(" "))
    //         notes.push(assmNotes[i].external.toLowerCase().split(" "))
    //         splitNotes.push(notes)
    //     } catch (err) {
    //         if (!err instanceof TypeError) {
    //             console.log(err)
    //         }
    //     }
    // }

    // console.log(splitNotes[0])
    // console.log(userNames[0])
    // console.log(assmNotes[0].internal)

}



module.exports = {
    replaceNewNames,
    replaceExistingNames
};