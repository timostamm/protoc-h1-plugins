const TypescriptMessageReference = require('./TypescriptMessageReference');
const TypescriptWellKnownType = require('./TypescriptWellKnownType');
const TypescriptMap = require('./TypescriptMap');
const TypescriptEnum = require('./TypescriptEnum');


class TypescriptMessageField {

    /**
     * @param {string} name
     * @param {boolean} repeated
     * @param {*} type
     * @param {string} [comment]
     * @param {string|} [trailingComment]
     */
    constructor(name, repeated, type, comment, trailingComment) {
        this.name = name;
        this.repeated = repeated;
        this.type = type;
        this.comment = comment === undefined ? '' : comment;
        this.trailingComment = trailingComment === undefined ? '' : trailingComment;
    }
}


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
     * @param {string} trailingComment
     */
    setFieldCommentTrailing(name, trailingComment) {
        if (!this.hasField(name)) {
            throw new Error(`${this.getQualifiedName()} does not have field "${name}".`);
        }
        this.fields.find(f => f.name === name).trailingComment = trailingComment;
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
        this.fields.push(new TypescriptMessageField(name, false, type));
    }


    /**
     * @param {string} name
     * @param {boolean} repeated
     * @param {TypescriptEnum} tsEnum
     */
    addEnumField(name, repeated, tsEnum) {
        this.fields.push(new TypescriptMessageField(name, repeated, tsEnum));
    }


    /**
     * @param {string} name
     * @param {boolean} repeated
     * @param {TypescriptMessage|TypescriptMessageReference|TypescriptWellKnownType} tsMessage
     */
    addMessageField(name, repeated, tsMessage) {
        this.fields.push(new TypescriptMessageField(name, repeated, tsMessage));
    }

    /**
     * @param {string} name
     * @param {boolean} repeated
     * @param {string} type
     */
    addScalarField(name, repeated, type) {
        this.fields.push(new TypescriptMessageField(name, repeated, type));
    }


    /**
     * @param {function(typeName:string ):string} resolve
     * @param {function(entryTypeName:string ):array} lookupMapTyping
     * @return {string}
     */
    render(resolve, lookupMapTyping) {
        const a = [];

        if (this.comment.length > 0) {
            a.push(`/**`);
            a.push(...this.comment.split("\n").map(l => ` * ${l}`));
            a.push(` */`);
        }

        const isNested = this.parentMessageNames.length > 0;

        if (isNested) {
            a.push(
                `export namespace ${this.parentMessageNames.join('.')} {`,
                `\texport interface ${this.messageName} {`,
                '\t',
                ...this.renderFields(resolve, lookupMapTyping, 2),
                `\t}`,
                `}`
            );
        } else {
            a.push(
                `export interface ${this.messageName} {`,
                '',
                ...this.renderFields(resolve, lookupMapTyping, 1),
                `}`
            );
        }

        return a.join("\n") + "\n";
    }

    /**
     * @param {function(typeName:string ):string} resolve
     * @param {function(entryTypeName:string ):array} lookupMapTyping
     * @param {number} indent
     * @return {Array<string>}
     */
    renderFields(resolve, lookupMapTyping, indent) {
        const a = [];
        for (const field of this.fields) {

            if (field.comment.length > 0) {
                const commentLines = field.comment.split("\n");
                if (commentLines.length === 1) {
                    a.push(`/** ${commentLines[0].trim()} */`);
                } else {
                    a.push(
                        `/**`,
                        ...commentLines.map(l => ` * ${l}`),
                        ` */`
                    );
                }
            }

            let fieldLine;
            if (field.type instanceof TypescriptMap) {
                const typing = lookupMapTyping(field.type.entryTypeName);
                const valueType = resolve(typing[1]);
                fieldLine = `${field.name}?: { [index: ${typing[0]}]: ${valueType} };`;
            } else if (field.type instanceof TypescriptEnum) {
                fieldLine = `${field.name}?: ${field.type.getLiteralUnion()};`;
            } else {
                const t = typeof field.type === "string"
                    ? field.type
                    : resolve(field.type.getQualifiedName());
                if (field.repeated) {
                    fieldLine = `${field.name}?: Array<${t}>;`;
                } else {
                    fieldLine = `${field.name}?: ${t};`;
                }
            }
            if (field.trailingComment.length > 0) {
                fieldLine += ' // ' + field.trailingComment;
            }

            a.push(fieldLine);
            a.push(``);
        }
        return a.map(l => "\t".repeat(indent) + l);
    }


    getQualifiedName() {
        let n = `.${this.packageName}`;
        if (Array.isArray(this.parentMessageNames) && this.parentMessageNames.length > 0) {
            n += '.' + this.parentMessageNames.join('.');
        }
        n += `.${this.messageName}`;
        return n;
    }


    toString() {
        return `TypescriptMessage(${this.getQualifiedName()})`;
    }

};
