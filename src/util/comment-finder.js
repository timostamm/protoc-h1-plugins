/**
 * @param {proto.google.protobuf.FileDescriptorProto} proto
 * @param messageIndex
 * @param {string|undefined} [prefix]
 * @return {string}
 */
function message(proto, messageIndex, prefix) {
    const locations = proto.getSourceCodeInfo().getLocationList()
        .filter(l => {
            const p = l.getPathList();
            return p.length === 2
                && p[0] === 4 // type message
                && p[1] === messageIndex;
        });
    const c = getFirstLeadingComment(locations);
    if (typeof prefix === "string") {
        return addPrefix(c, prefix);
    }
    return c;
}

/**
 * @param {proto.google.protobuf.FileDescriptorProto} proto
 * @param {proto.google.protobuf.DescriptorProto} message
 * @param {string} fieldName
 * @param {string|undefined} [prefix]
 * @return {string}
 */
function messageField(proto, message, fieldName, prefix) {
    const messageIndex = proto.getMessageTypeList().indexOf(message);
    const fieldIndex = message.getFieldList().findIndex(f => f.getName() === fieldName);
    const locations = proto.getSourceCodeInfo().getLocationList()
        .filter(l => {
            const p = l.getPathList();
            return p.length === 4
                && p[0] === 4 // type message
                && p[1] === messageIndex
                && p[2] === 2 // field
                && p[3] === fieldIndex;
        });
    const c = getFirstLeadingComment(locations);
    if (typeof prefix === "string") {
        return addPrefix(c, prefix);
    }
    return c;
}



/**
 * @param {proto.google.protobuf.FileDescriptorProto} proto
 * @param serviceIndex
 * @param {string|undefined} prefix
 * @return {string}
 */
function service(proto, serviceIndex, prefix) {
    const locations = proto.getSourceCodeInfo().getLocationList()
        .filter(l => {
            const p = l.getPathList();
            return p.length === 2
                && p[0] === 6 // type service
                && p[1] === serviceIndex;
        });
    const c = getFirstLeadingComment(locations);
    if (typeof prefix === "string") {
        return addPrefix(c, prefix);
    }
    return c;
}


/**
 * @param {proto.google.protobuf.FileDescriptorProto} proto
 * @param serviceIndex
 * @param methodName
 * @param {string|undefined} prefix
 * @return {string}
 */
function serviceMethod(proto, serviceIndex, methodName, prefix) {
    const methodIndex = proto.getServiceList()[serviceIndex].getMethodList()
        .findIndex(m => m.getName() === methodName);
    const locations = proto.getSourceCodeInfo().getLocationList()
        .filter(l => {
            const p = l.getPathList();
            return p.length === 4
                && p[0] === 6 // message type service
                && p[1] === serviceIndex
                && p[2] === 2 // field
                && p[3] === methodIndex;
        });
    const c = getFirstLeadingComment(locations);
    if (typeof prefix === "string") {
        return addPrefix(c, prefix);
    }
    return c;
}


function getFirstLeadingComment(locations) {
    if (locations.length === 0) {
        return '';
    }
    const c = locations[0].getLeadingComments();
    if (c.trim().length === 0) {
        return '';
    }
    return c.trimRight();
}


function addPrefix(comment, prefix) {
    return comment.split("\n")
        .map(l => l.trim())
        .filter((l, i, a) => {
            if (i === 0 || i === a.length-1) {
                return l.length > 0;
            }
            return true;
        })
        .map(l => `${prefix}${l}`)
        .join("\n");
}


module.exports = {};
module.exports.message = message;
module.exports.messageField = messageField;
module.exports.service = service;
module.exports.serviceMethod = serviceMethod;
