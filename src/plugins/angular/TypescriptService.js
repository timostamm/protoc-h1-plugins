module.exports = class TypescriptService {


    constructor(protoName, packageName, serviceName) {
        this.comment = "";
        this.protoName = protoName;
        this.packageName = packageName;
        this.serviceName = serviceName;
        this.methods = [];
    }

    getQualifiedName() {
        return `.${this.packageName}.${this.serviceName}`;
    }


    /**
     *
     * @param {string} name
     * @param {TypescriptMessage|TypescriptMessageReference|TypescriptWellKnownType} inputType
     * @param {TypescriptMessage|TypescriptMessageReference|TypescriptWellKnownType} outputType
     * @param {string} comment
     * @param {boolean} deprecated
     */
    addMethod(name, inputType, outputType, comment, deprecated) {
        this.methods.push({
            name: name,
            inputType: inputType,
            outputType: outputType,
            comment: comment,
            deprecated: deprecated
        });
    }


    /**
     * @param {function(typeName:string ):string} resolve
     * @param {boolean} exportStatement
     * @return {string}
     */
    render(resolve, exportStatement = true) {
        const a = [];
        if (this.comment.length > 0) {
            a.push(`/**`);
            a.push(... this.comment.split("\n").map(l => ` * ${l}`));
            a.push(` */`);
        }
        if (exportStatement) {
            a.push(`export interface ${this.serviceName}Interface {`);
        } else {
            a.push(`interface ${this.serviceName}Interface {`);
        }
        a.push('');
        for (const method of this.methods) {

            const name = method.name.charAt(0).toLowerCase() + method.name.substr(1);
            const inputType = resolve(method.inputType.getQualifiedName());
            const innerOutputType = resolve(method.outputType.getQualifiedName());
            const outputType = `Promise<${innerOutputType}>`;


            // TODO promise or Observable return type

            if (method.comment.length > 0 || method.deprecated) {
                a.push(`\t/**`);
                if (method.comment.length > 0) {
                    a.push(... method.comment.split("\n").map(l => `\t * ${l}`));
                }
                if (method.deprecated) {
                    if (method.comment.length > 0) {
                        a.push(`\t * `);
                    }
                    a.push(`\t * @deprecated`);
                }
                a.push(`\t */`);
            }

            a.push(`\t${name}(request: ${inputType}): ${outputType};`);
            a.push('');

        }
        a.push(`}`);
        return a.join("\n") + "\n";
    }

};
