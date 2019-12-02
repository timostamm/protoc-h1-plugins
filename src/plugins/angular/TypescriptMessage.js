const TypescriptMessageReference = require('./TypescriptMessageReference');
const TypescriptWellKnownType = require('./TypescriptWellKnownType');
const TypescriptMap = require('./TypescriptMap');
const TypescriptEnum = require('./TypescriptEnum');


module.exports = class TypescriptMessage {


    constructor(protoName, packageName, messageName) {
        this.protoName = protoName;
        this.packageName = packageName;
        this.messageName = messageName;
        this.parentMessageNames = [];
        this.fields = [];
        this.comment = "";
    }


    /**
     * @param {string[]} parentMessageNames
     */
    setParentMessageNames(parentMessageNames) {
        this.parentMessageNames = parentMessageNames;
    }


    /**
     * @param {string} name
     * @param {string} comment
     */
    setFieldComment(name, comment) {
        if (!this.hasField(name)) {
            throw new Error(`${this.getQualifiedName()} does not have field "${name}".`);
        }
        this.fields.find(f => f.name === name).comment = comment;
    }


    /**
     * @param {string} name
     * @return {boolean}
     */
    hasField(name) {
        return this.fields.some(f => f.name === name);
    }


    /**
     * @param {string} name
     * @return {string|TypescriptMessage|TypescriptWellKnownType|TypescriptMessageReference|TypescriptEnum}
     */
    getFieldType(name) {
        if (!this.hasField(name)) {
            throw new Error(`${this.getQualifiedName()} does not have field "${name}".`);
        }
        return this.fields.find(f => f.name === name).type;
    }


    /**
     * @param {string} name
     * @param {TypescriptMap} type
     */
    addMapField(name, type) {
        this.fields.push({
            name: name,
            repeated: false,
            type: type,
            comment: ''
        });
    }


    /**
     * @param {string} name
     * @param {boolean} repeated
     * @param {TypescriptEnum} tsEnum
     */
    addEnumField(name, repeated, tsEnum) {
        this.fields.push({
            name: name,
            repeated: repeated,
            type: tsEnum,
            comment: ''
        });
    }


    /**
     * @param {string} name
     * @param {boolean} repeated
     * @param {TypescriptMessage|TypescriptMessageReference|TypescriptWellKnownType} tsMessage
     */
    addMessageField(name, repeated, tsMessage) {
        this.fields.push({
            name: name,
            repeated: repeated,
            type: tsMessage,
            comment: ''
        });
    }

    /**
     * @param {string} name
     * @param {boolean} repeated
     * @param {string} type
     */
    addScalarField(name, repeated, type) {
        this.fields.push({
            name: name,
            repeated: repeated,
            type: type,
            comment: ''
        });
    }


    /**
     * @param {function(typeName:string ):string} resolve
     * @param {function(entryTypeName:string ):array} lookupMapTyping
     * @param {boolean} exportStatement
     * @return {string}
     */
    render(resolve, lookupMapTyping, exportStatement = true) {
        const a = [];

        if (this.comment.length > 0) {
            a.push(`/**`);
            a.push(... this.comment.split("\n").map(l => ` * ${l}`));
            a.push(` */`);
        }
        if (exportStatement) {
            a.push(`export interface ${this.messageName} {`);
        } else {
            a.push(`interface ${this.messageName} {`);
        }
        a.push(``);
        for (const field of this.fields) {

            if (field.comment.length > 0) {
                const commentLines = field.comment.split("\n");
                if (commentLines.length === 1) {
                    a.push(`\t/** ${commentLines[0].trim()} */`);
                } else {
                    a.push(
                        `\t/**`,
                        ... commentLines.map(l => `\t * ${l}`),
                        `\t */`
                    );
                }
            }

            if (field.type instanceof TypescriptMap) {
                const typing = lookupMapTyping(field.type.entryTypeName);
                const valueType = resolve(typing[1]);
                a.push(`\t${field.name}: { [index: ${typing[0]}]: ${valueType} };`);

            } else if (field.type instanceof TypescriptEnum) {
                a.push(`\t${field.name}: ${field.type.getLiteralUnion()};`);

            } else {

                const t = typeof field.type === "string"
                    ? field.type
                    : resolve(field.type.getQualifiedName());

                if (field.repeated) {
                    a.push(`\t${field.name}: Array<${t}>;`);
                } else {
                    a.push(`\t${field.name}: ${t};`);
                }

            }

            a.push(``);
        }
        a.push(`}`);
        return a.join("\n") + "\n";
    }


    toString(fields = false) {
        if (!fields) {
            return `TypescriptMessage(${this.getQualifiedName()})`;
        }
        const a = [];
        a.push(`TypescriptMessage ${this.messageName} {`);
        for (const field of this.fields) {
            const t = typeof field.type === "string" ? field.type : field.type;
            if (field.repeated) {
                a.push(`\t${field.name}: Array<${t}>;`);
            } else {
                a.push(`\t${field.name}: ${t};`);
            }
        }
        a.push(`}`);
        return a.join("\n") + "\n";
    }


    getQualifiedName() {
        let n = `.${this.packageName}`;
        if (Array.isArray(this.parentMessageNames) && this.parentMessageNames.length > 0) {
            n += '.' + this.parentMessageNames.join('.');
        }
        n += `.${this.messageName}`;
        return n;
    }

};
