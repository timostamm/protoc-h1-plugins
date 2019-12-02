
module.exports = class TypescriptMessageReference {

    constructor(qualifiedName) {
        this.qualifiedName = qualifiedName;
    }

    getQualifiedName() {
        return this.qualifiedName;
    }

    toString() {
        return `TypescriptMessageReference(${this.getQualifiedName()})`;
    }

};
