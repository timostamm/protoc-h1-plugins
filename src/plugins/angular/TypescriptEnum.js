module.exports = class TypescriptEnum {

    /**
     * @param {string} protoName
     * @param {string} packageName
     * @param {proto.google.protobuf.EnumDescriptorProto} enumDescriptorProto
     * @return {TypescriptEnum}
     */
    static fromDescriptor(protoName, packageName, enumDescriptorProto) {
        const t = new TypescriptEnum(protoName, packageName, enumDescriptorProto.getName());
        t.addValuesFromDescriptorValueList(enumDescriptorProto.getValueList());
        return t;
    }

    /**
     * @param {string} protoName
     * @param {string} packageName
     * @param {string} enumName
     */
    constructor(protoName, packageName, enumName) {
        this.protoName = protoName;
        this.packageName = packageName;
        this.enumName = enumName;
        this.parentMessageNames = [];
        this.values = [];
    }

    /**
     * @param {string[]} parentMessageNames
     */
    setParentMessageNames(parentMessageNames) {
        this.parentMessageNames = parentMessageNames;
    }

    /**
     * @param  {Array<proto.google.protobuf.EnumValueDescriptorProto>} valueList
     */
    addValuesFromDescriptorValueList(valueList) {
        for (const v of valueList) {
            this.addValue(v.getName(), v.getNumber());
        }
    }

    addValue(stringValue, index) {
        this.values[index] = stringValue;
    }

    getLiteralUnion() {
        return this.values
            .map(name => `'${name}'`)
            .join(' | ');
    }

    getQualifiedName() {
        let n = `.${this.packageName}`;
        if (Array.isArray(this.parentMessageNames) && this.parentMessageNames.length > 0) {
            n += '.' + this.parentMessageNames.join('.');
        }
        n += `.${this.enumName}`;
        return n;
    }

    toString() {
        return `TypescriptEnum(${this.getQualifiedName()})`;
    }

};
