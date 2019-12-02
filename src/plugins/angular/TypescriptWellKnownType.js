
module.exports = class TypescriptWellKnownType {


    /**
     * @param {string} typeName
     * @return {boolean}
     */
    static isWellKnownType(typeName) {
        return typeName.startsWith(".google.protobuf.");
    }

    constructor(qualifiedName) {
        this.qualifiedName = qualifiedName;
    }

    getQualifiedName() {
        return this.qualifiedName;
    }


    toString() {
        return `TypescriptWellKnownType(${this.getQualifiedName()})`;
    }

};
