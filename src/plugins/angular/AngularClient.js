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

        this.addResponseFile('wellknowntypes.d.ts', fs.readFileSync(__dirname + '/wellknowntypes.d.ts', 'utf8'));

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

        for (const proto of this.request.getProtoFileList()) {
            const file = new TypescriptFile(`${proto.getPackage()}.d.ts`);
            const resolve = (typeName) => {
                if (typeName.startsWith('.google.protobuf.')) {
                    file.addImport('./wellknowntypes');
                } else if (!typeName.startsWith(`.${proto.getPackage()}`)) {
                    const tsMessage = this.messageByName[typeName];
                    if (tsMessage instanceof TypescriptMessage) {
                        file.addImport(tsMessage.packageName);
                    } else {
                        throw new Error(`Unable to add import for type ${typeName}.`);
                    }
                }
                return typeName.substr(1);
            };
            file.startNamespace(proto.getPackage());
            for (const tsMessage of this.messages) {
                if (this.mapEntryMessageNames.hasOwnProperty(tsMessage.getQualifiedName())) {
                    continue;
                }
                if (tsMessage.packageName !== proto.getPackage()) {
                    continue;
                }
                file.add(
                    tsMessage.render(resolve, lookupMapTyping, true)
                );
            }
            for (const tsService of this.services) {
                if (tsService.packageName !== proto.getPackage()) {
                    continue;
                }
                file.add(
                    tsService.render(resolve, true)
                );
            }
            file.stopNamespace();
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

        for (const enumDescriptorProto of message.getEnumTypeList()) {
            const tsEnum = TypescriptEnum.fromDescriptor(proto.getName(), proto.getPackage(), enumDescriptorProto);
            tsEnum.setParentMessageNames(parentMessageNames.concat([message.getName()]));
            this.enums.push(tsEnum);
            this.enumByName[tsEnum.getQualifiedName()] = tsEnum;
        }

        for (const nestedMessage of message.getNestedTypeList()) {
            this.addMessage(proto, nestedMessage, parentMessageNames.concat([message.getName()]));
        }

        const tsMessage = new TypescriptMessage(proto.getName(), proto.getPackage(), message.getName());
        tsMessage.comment = comments.message(proto, proto.getMessageTypeList().indexOf(message));
        tsMessage.setParentMessageNames(parentMessageNames);
        this.messages.push(tsMessage);
        this.messageByName[tsMessage.getQualifiedName()] = tsMessage;

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

        }

    }


}


module.exports = AngularClient;

