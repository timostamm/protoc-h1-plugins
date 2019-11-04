/**
 * @param proto
 * @param serviceIndex
 * @param {string|undefined} prefix
 * @return {string}
 */
function service(proto, serviceIndex, prefix) {
    const locations = proto.getSourceCodeInfo().getLocationList()
        .filter(l => {
            const p = l.getPathList();
            return p.length === 2
                && p[0] === 6 // message type service
                && p[1] === serviceIndex;
        });
    const c = getFirstLeadingComment(locations);
    if (typeof prefix === "string") {
        return addPrefix(c, prefix);
    }
    return c;
}


/**
 * @param proto
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
    return c;
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
module.exports.service = service;
module.exports.serviceMethod = serviceMethod;
