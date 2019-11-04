const streamToPromise = require('stream-to-promise');
const tou8 = require('buffer-to-uint8array');
const pluginPb = require('google-protobuf/google/protobuf/compiler/plugin_pb');
const descriptorPb = require('google-protobuf/google/protobuf/descriptor_pb');


class Plugin {


    constructor() {
    }


    async run(process) {
        try {
            const requestData = tou8(await streamToPromise(process.stdin));
            this.request = pluginPb.CodeGeneratorRequest.deserializeBinary(requestData);
            this.response = new pluginPb.CodeGeneratorResponse();
            await this.handleRequest();
            process.stdout.write(Buffer.from(this.response.serializeBinary()))
        } catch (e) {
            if (e instanceof Error) {
                console.error(e.stack);
            } else {
                console.error(e);
            }
            // const response = new pluginPb.CodeGeneratorResponse();
            // response.setError("xxx" +e);
            // stdout.write(Buffer.from(response.serializeBinary()))
            process.exit(1);
        }
    }


    addResponseFile(name, content) {
        const file = new pluginPb.CodeGeneratorResponse.File();
        file.setName(name);
        file.setContent(content);
        this.response.addFile(file);
    }


    handleRequest() {
        for (const proto of this.request.getProtoFileList()) {
            if (!this.request.getFileToGenerateList().includes(proto.getName())) {
                continue;
            }
            this.handleProto(proto);
            for (let i = 0; i < proto.getMessageTypeList().length; i++) {
                const message = proto.getMessageTypeList()[i];
                this.renderMessage(proto, message, i);
            }
            for (let i = 0; i < proto.getServiceList().length; i++) {
                const service = proto.getServiceList()[i];
                this.renderService(proto, service, i);
            }
        }
    }


    handleProto(proto) {

    }


    renderService(proto, service, serviceIndex) {

    }


    renderMessage(proto, message, messageIndex) {

    }


    /**
     * @param fqn
     * @return {string|null}
     */
    findMessageTypeCsharp(fqn) {
        /** @var {pluginPb.CodeGeneratorRequest} request */
        for (const proto of this.request.getProtoFileList()) {
            for (const messageType of proto.getMessageTypeList()) {
                const n = `.${proto.getPackage()}.${messageType.getName()}`.replace('..', '.');
                if (fqn === n) {
                    return `global::${proto.getOptions().getCsharpNamespace()}.${messageType.getName()}`;
                    // return `${proto.getOptions().getPhpNamespace()}\\${messageType.getName()}`;
                }
            }
        }
        return null;
    }


    /**
     * @param fqn
     * @return {string|null}
     */
    findMessageTypePhp(fqn) {
        for (const proto of this.request.getProtoFileList()) {
            for (const messageType of proto.getMessageTypeList()) {
                const n = `.${proto.getPackage()}.${messageType.getName()}`.replace('..', '.');
                if (fqn === n) {
                    return `\\${proto.getOptions().getPhpNamespace()}\\${messageType.getName()}`;
                }
            }
        }
        return null;
    }

}

module.exports = Plugin;
