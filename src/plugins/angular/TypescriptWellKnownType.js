
module.exports = class TypescriptWellKnownType {

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
