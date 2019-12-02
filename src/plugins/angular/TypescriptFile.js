module.exports = class TypescriptFile {

    constructor(name) {
        this.name = name;
        this.importPaths = {};
        this.lines = [];
        this.currentNamespace = false;
        this.empty = true;
    }

    /**
     * @param {string} path
     */
    addImport(path) {
        if (!path.startsWith('/') && !path.startsWith('./') && !path.startsWith('../')) {
            path = './' + path;
        }
        this.importPaths[path] = path;
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
        return [
            '// Generated code - do not edit!',
            ...Object.keys(this.importPaths).map(path => `import '${path}';`),
            '',
            ...this.lines
        ].join("\n");
    }

};
