/**
 * THIS IS A WIP COMMIT. PLEASE USE `git commit --amend` WHEN IT'S DONE
 */

export class NameReplacer {
    /**
     * Connects to the database and fetches all names on init().
     * But init can't be in the construcotr cause constructor has to be sync.
     * There also needs to be a concept of "run", or something in which the numbering is kept.
     * Or simpley a reset() method
     */
    constructor() {
        this.allNames = []
        this.usedNames = []
    }
    async init() {
        this.allNames = await ['some', 'db', 'function']
    }
    reset() {
        this.usedNames = []
    }
    pseudoNameFromUsedName(usedName) {
        return `Person${this.usedNames.indexOf(usedName)}`
    }
    replaceWord(word) {
        if (this.usedNames.includes(word)) return this.pseudoNameFromUsedName(word)
        if (this.allNames.includes(word)) {
            this.usedNames.push(word)
            return this.pseudoNameFromUsedName(word)
        }
        return word
    }
    replaceAllInText(text) {
        // TODO: Think about commas, \n etc
        return text.split(' ').map(word => this.replaceWord(word)).join(' ')
    }
}