const con = require("./consolelog")

class NameAnonymizer {
    allNames = {}

    constructor(allNames, anonNameNumberRange = 100000) {
        if (!allNames) return
        this.anonNameNumberRange = anonNameNumberRange
        if (anonNameNumberRange < allNames.length) throw new Error('Anonymous name number range cannot be smaller than the number of names.')
        if (anonNameNumberRange < allNames.length * 2) console.log(con.warn, 'Anonymous name number range is very low which can lead to slow performance.')
        // randmoize mapping so it can't be traced back
        for (const name of allNames) {
            do {
                const anonNameNumber = Math.floor(Math.random() * anonNameNumberRange)
                if (Object.values(this.allNames).includes(anonNameNumber)) continue
                this.allNames[name] = anonNameNumber
            } while (!Object.keys(this.allNames).includes(name))
        }
    }
    anonymizeAllNamesInText(text) {
        if (text) {
            // remove accents (same code that was used when names were added to DB)
            text.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .split('ß').join('ss')
            // replace names
            for (const [ name, anonNumber ] of Object.entries(this.allNames)) {
                const regExp = new RegExp(`\\b${name}\\b`, 'gi')
                text = text.replace(regExp, `Person${anonNumber}`)
            }
        }
        return text
    }
}

module.exports = {
    NameAnonymizer,
}
