module.exports = class TypescriptMap {


    /**
     * @param {string} messageQualifiedName
     * @param {string} fieldName
     * @param {string} fieldTypeName
     * @return {boolean}
     */
    static isMapField(messageQualifiedName, fieldName, fieldTypeName) {
        return `${messageQualifiedName}.${fieldName}Entry`.toLowerCase() === fieldTypeName.toLowerCase();
    }

    /**
     * @param {string} entryTypeName
     */
    constructor(entryTypeName) {
        this.entryTypeName = entryTypeName;
    }

    toString() {
        return `TypescriptMap(${this.entryTypeName})`;
    }

};
