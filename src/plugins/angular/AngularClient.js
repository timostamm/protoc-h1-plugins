const fs = require('fs');
const Plugin = require('../../util/plugin');
const comments = require('../../util/comment-finder');
require('google-protobuf/google/protobuf/descriptor_pb');
const FieldType = proto.google.protobuf.FieldDescriptorProto.Type;
const TypescriptMessage = require('./TypescriptMessage');
const TypescriptMessageReference = require('./TypescriptMessageReference');
const TypescriptWellKnownType = require('./TypescriptWellKnownType');
const TypescriptEnum = require('./TypescriptEnum');
const TypescriptMap = require('./TypescriptMap');
const TypescriptService = require('./TypescriptService');
const TypescriptFile = require('./TypescriptFile');


class AngularClient extends Plugin {


    constructor() {
        super();
        this.messages = [];
        this.messageByName = [];
        this.mapEntryMessageNames = {};
        this.enumByName = {};
        this.enums = [];
        this.services = [];
    }


    handleRequest() {
        super.handleRequest();

        this.addResponseFile('wellknowntypes.ts', fs.readFileSync(__dirname + '/wellknowntypes.ts', 'utf8'));

        // maps are just syntactic sugar.
        // for each map field, a message type for the entries is generated by protoc.
        // on the wire, a map field is just a repeat of the entries.
        // this function returns K and V from the entry message.
        const lookupMapTyping = (entryTypeName) => {
            const m = this.messageByName[entryTypeName];
            const kt = m.getFieldType('key');
            let k;
            if (kt instanceof TypescriptWellKnownType && kt.getQualifiedName().indexOf('Int32Value') >= 0) {
                k = 'number';
            } else {
                k = kt;
            }
            const vt = m.getFieldType('value');
            let v;
            if (typeof vt === "string") {
                v = vt;
            } else {
                v = vt.getQualifiedName();
            }
            return [k, v];
        };

        // one file for each package
        const packageFiles = TypescriptFile.prepareMap(this.request.getProtoFileList());

        // walk all proto files
        for (const proto of this.request.getProtoFileList()) {
            const file = packageFiles[proto.getPackage()];

            // resolver adds import statements to our .ts file
            const resolve = (typeName) => {
                if (typeName.startsWith('.google.protobuf.')) {
                    file.addImport('./wellknowntypes', 'google');
                    return typeName.substr(1);

                } else if (typeName.startsWith(`.${proto.getPackage()}.`)) {

                    return typeName.substr(`.${proto.getPackage()}.`.length);

                } else {

                    const tsMessage = this.messageByName[typeName];
                    if (tsMessage instanceof TypescriptMessage) {

                        if (tsMessage.parentMessageNames.length === 0) {
                            return file.addImport('./' + tsMessage.packageName, tsMessage.messageName);
                        }

                        // we have a nested message
                        const names = tsMessage.parentMessageNames.concat(tsMessage.messageName);

                        // add an import for the outer message:
                        const symbol = file.addImport('./' + tsMessage.packageName, names.shift());

                        // then use the imported symbol + remaining qualified name to reference the nested message:
                        return `${symbol}.${names.join('.')}`;

                    } else {
                        throw new Error(`Unable to add import for type ${typeName}.`);
                    }
                }
            };

            // add messages and services to file
            for (const tsMessage of this.messages.filter(m => m.packageName === proto.getPackage() && m.protoName === proto.getName())) {
                if (this.mapEntryMessageNames.hasOwnProperty(tsMessage.getQualifiedName())) {
                    continue;
                }
                file.add(tsMessage.render(resolve, lookupMapTyping));
            }
            for (const tsService of this.services.filter(s => s.packageName === proto.getPackage() && s.protoName === proto.getName())) {
                file.addImport('rxjs', 'Observable');
                // file.add(tsService.renderInterface(resolve, 'observable'));
                file.addImport('@angular/common/http', 'HttpClient');
                file.add(tsService.renderClient(resolve, 'observable'));
            }
        }

        // write files
        for (const k in packageFiles) {
            const file = packageFiles[k];
            if (!file.empty) {
                this.addResponseFile(file.name, file.getContents());
            }
        }
    }


    handleService(proto, service, serviceIndex) {
        const tsService = new TypescriptService(proto.getName(), proto.getPackage(), service.getName());
        tsService.comment = comments.service(proto, serviceIndex, "");
        this.services.push(tsService);
        const methods = service.getMethodList().filter(method => !method.getClientStreaming() && !method.getServerStreaming());
        for (const method of methods) {
            const inputType = TypescriptWellKnownType.isWellKnownType(method.getInputType())
                ? new TypescriptWellKnownType(method.getInputType())
                : this.messageByName[method.getInputType()];
            const outputType = TypescriptWellKnownType.isWellKnownType(method.getOutputType())
                ? new TypescriptWellKnownType(method.getOutputType())
                : this.messageByName[method.getOutputType()];
            const deprecated = method.getOptions() ? method.getOptions().hasDeprecated() : false;
            const comment = comments.serviceMethod(proto, serviceIndex, method.getName(), "");
            tsService.addMethod(method.getName(), inputType, outputType, comment, deprecated);
        }
    }


    handlePackageEnum(proto, enumDescriptorProto, index) {
        this.addEnum(proto, enumDescriptorProto, []);
    }


    handlePackageMessage(proto, message, messageIndex) {
        this.addMessage(proto, message, []);
    }


    /**
     * @param {proto.google.protobuf.FileDescriptorProto} proto
     * @param {proto.google.protobuf.EnumDescriptorProto} enumDescriptorProto
     * @param {string[]} parentMessageNames
     */
    addEnum(proto, enumDescriptorProto, parentMessageNames) {
        const tsEnum = TypescriptEnum.fromDescriptor(proto.getName(), proto.getPackage(), enumDescriptorProto);
        if (Array.isArray(parentMessageNames)) {
            tsEnum.setParentMessageNames(parentMessageNames);
        }
        this.enums.push(tsEnum);
        this.enumByName[tsEnum.getQualifiedName()] = tsEnum;
    }


    /**
     * @param {proto.google.protobuf.FileDescriptorProto} proto
     * @param {proto.google.protobuf.DescriptorProto} message
     * @param {string[]} parentMessageNames
     */
    addMessage(proto, message, parentMessageNames) {

        // add all nested enums
        for (const enumDescriptorProto of message.getEnumTypeList()) {
            const tsEnum = TypescriptEnum.fromDescriptor(proto.getName(), proto.getPackage(), enumDescriptorProto);
            tsEnum.setParentMessageNames(parentMessageNames.concat([message.getName()]));
            this.enums.push(tsEnum);
            this.enumByName[tsEnum.getQualifiedName()] = tsEnum;
        }

        // add the message
        const tsMessage = new TypescriptMessage(proto.getName(), proto.getPackage(), message.getName());
        tsMessage.comment = comments.message(proto, proto.getMessageTypeList().indexOf(message));
        tsMessage.setParentMessageNames(parentMessageNames);
        this.messages.push(tsMessage);
        this.messageByName[tsMessage.getQualifiedName()] = tsMessage;

        // add all fields to the message
        for (const fd of message.getFieldList()) {

            const name = fd.getJsonName().length > 0 ? fd.getJsonName() : fd.getName();
            const repeated = fd.getLabel() === 3;

            switch (fd.getType()) {
                case FieldType.TYPE_DOUBLE:
                    tsMessage.addMessageField(name, repeated, new TypescriptWellKnownType(".google.protobuf.DoubleValue"));
                    break;
                case FieldType.TYPE_FLOAT:
                    tsMessage.addMessageField(name, repeated, new TypescriptWellKnownType(".google.protobuf.FloatValue"));
                    break;

                case FieldType.TYPE_UINT32:
                    tsMessage.addMessageField(name, repeated, new TypescriptWellKnownType(".google.protobuf.UInt32Value"));
                    break;
                case FieldType.TYPE_INT32:
                case FieldType.TYPE_SINT32:
                case FieldType.TYPE_FIXED32:
                case FieldType.TYPE_SFIXED32:
                    tsMessage.addMessageField(name, repeated, new TypescriptWellKnownType(".google.protobuf.Int32Value"));
                    break;

                case FieldType.TYPE_UINT64:
                    tsMessage.addMessageField(name, repeated, new TypescriptWellKnownType(".google.protobuf.UInt64Value"));
                    break;
                case FieldType.TYPE_INT64:
                case FieldType.TYPE_SINT64:
                case FieldType.TYPE_FIXED64:
                case FieldType.TYPE_SFIXED64:
                    tsMessage.addMessageField(name, repeated, new TypescriptWellKnownType(".google.protobuf.Int64Value"));
                    break;

                case FieldType.TYPE_BYTES:
                    tsMessage.addMessageField(name, repeated, new TypescriptWellKnownType(".google.protobuf.BytesValue"));
                    break;

                case FieldType.TYPE_BOOL:
                    tsMessage.addScalarField(name, repeated, "boolean");
                    break;

                case FieldType.TYPE_STRING:
                    tsMessage.addScalarField(name, repeated, "string");
                    break;

                case FieldType.TYPE_MESSAGE:
                    if (TypescriptWellKnownType.isWellKnownType(fd.getTypeName())) {
                        tsMessage.addMessageField(name, repeated, new TypescriptWellKnownType(fd.getTypeName()));

                    } else if (TypescriptMap.isMapField(tsMessage.getQualifiedName(), name, fd.getTypeName())) {
                        tsMessage.addMapField(name, new TypescriptMap(fd.getTypeName()));
                        this.mapEntryMessageNames[fd.getTypeName()] = fd.getTypeName();

                    } else {
                        const type = this.messageByName[fd.getTypeName()];
                        if (type instanceof TypescriptMessage) {
                            tsMessage.addMessageField(name, repeated, type);
                        } else {
                            tsMessage.addMessageField(name, repeated, new TypescriptMessageReference(fd.getTypeName()));
                        }
                    }
                    break;

                case FieldType.TYPE_ENUM:
                    const tsEnum = this.enumByName[fd.getTypeName()];
                    if (tsEnum instanceof TypescriptEnum) {
                        tsMessage.addEnumField(name, repeated, tsEnum);
                    } else {
                        throw new Error(`Enum ${fd.getTypeName()} for field "${fd.getName()}" (${fd.getNumber()}) of message ${message.getName()} in file ${proto.getName()} not found.`);
                    }
                    break;

                default:
                    throw new Error(`Unsupported type ${fd.getType()} for field "${fd.getName()}" (${fd.getNumber()}) of message ${message.getName()} in file ${proto.getName()}.`);

            }

            tsMessage.setFieldComment(name, comments.messageField(proto, message, fd.getName(), undefined));
            tsMessage.setFieldCommentTrailing(name, comments.messageFieldTrailing(proto, message, fd.getName()));

        }

        // add all nested messages
        for (const nestedMessage of message.getNestedTypeList()) {
            this.addMessage(proto, nestedMessage, parentMessageNames.concat([message.getName()]));
        }

    }


}


module.exports = AngularClient;

