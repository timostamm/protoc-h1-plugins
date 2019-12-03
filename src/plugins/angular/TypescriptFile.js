module.exports = class TypescriptFile {


    /**
     * @param  {!Array<!proto.google.protobuf.FileDescriptorProto>} protos
     */
    static prepareMap(protos) {
        const files = {};
        for (const proto of protos) {
            if (files.hasOwnProperty(proto.getPackage())) {
                continue;
            }
            files[proto.getPackage()] = new TypescriptFile(`${proto.getPackage()}.ts`);
        }
        return files;
    }


    constructor(name) {
        this.name = name;
        this.imports = [];
        this.lines = [];
        this.currentNamespace = false;
        this.empty = true;
    }


    /**
     * @param {string} modulePath
     * @param {string|undefined} [symbol]
     * @return string
     */
    addImport(modulePath, symbol) {
        const exists = this.imports.find(i => i.modulePath === modulePath && i.symbol === symbol);
        if (exists) {
            return typeof exists.alias === "string" ? exists.alias : exists.symbol;
        }
        let s = symbol;
        let i = 1;
        while (this.isImportSymbolTaken(s)) {
            s = `${symbol}${i++}`;
        }
        this.imports.push({
            modulePath: modulePath,
            symbol: symbol,
            alias: s === symbol ? undefined : s
        });
        return s;
    }

    isImportSymbolTaken(symbol) {
        this.imports.some(i => i.symbol === symbol);
    }


    /**
     * @param {string} content
     * @param {boolean} pad
     */
    add(content, pad = true) {
        let lines = content.split("\n");
        if (lines.length === 0) {
            return;
        }
        this.empty = false;
        if (this.currentNamespace) {
            lines = lines.map(l => `\t${l}`);
        }
        if (pad) {
            this.lines.push('');
        }
        this.lines.push(...lines);
        if (pad) {
            this.lines.push('');
        }
        this.empty = false;
    }

    startNamespace(name) {
        this.currentNamespace = true;
        this.lines.push('');
        this.lines.push(`declare namespace ${name} {`);
        this.lines.push('');
    }

    stopNamespace() {
        this.currentNamespace = false;
        this.lines.push('');
        this.lines.push(`}`);
        this.lines.push('');
    }

    getContents() {

        const imports = this.imports.map(i => {
            if (typeof i.symbol === "string" && typeof i.alias === "string") {
                return `import {${i.symbol}} as ${i.alias} from '${i.modulePath}'`;
            }
            if (typeof i.symbol === "string") {
                return `import {${i.symbol}} from '${i.modulePath}'`;
            }
            return `import '${i.modulePath}'`;
        });

        return [
            '// Generated code - do not edit!',
            ...imports,
            '',
            ...this.lines
        ].join("\n");
    }

};
