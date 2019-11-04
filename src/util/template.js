const fs = require('fs');


class Template {


    /**
     * @param {string} content
     */
    constructor(content) {
        this.content = content;
    }


    replace(vars) {
        for (const key of Object.keys(vars)) {
            this.content = this.content.split(key).join(vars[key]);
        }
    }


    /**
     * @param {string} beginToken
     * @param {string} endToken
     * @param {Array<*>} items
     * @param {function} processor
     */
    repeatSection(beginToken, endToken, items, processor) {
        const indexStart = this.content.indexOf(beginToken);
        const indexEnd = this.content.indexOf(endToken);
        const section = this.content.substring(indexStart + beginToken.length, indexEnd);
        const repeated = [];
        for (const item of items) {
            const template = new Template(section);
            repeated.push(template);
            processor(item, template);
        }
        this.content = this.content.substring(0, indexStart)
            + repeated.join("\n\n")
            + this.content.substring(indexEnd + endToken.length);
    }


    /**
     * @param {string} beginToken
     * @param {string} endToken
     * @param {function} processor
     */
    replaceSection(beginToken, endToken, processor) {
        const indexStart = this.content.indexOf(beginToken);
        const indexEnd = this.content.indexOf(endToken);
        const section = this.content.substring(indexStart + beginToken.length, indexEnd);
        const template = new Template(section);
        processor(template);
        this.content = this.content.substring(0, indexStart)
            + template
            + this.content.substring(indexEnd + endToken.length);
    }


    toString() {
        return this.content;
    }

}


module.exports = Template;

module.exports.read = function (path) {
    let content = fs.readFileSync(path, 'utf8');
    return new Template(content);
};
