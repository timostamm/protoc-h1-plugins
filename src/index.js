#! /usr/bin/env node


const protocPlugin = require('protoc-plugin')


protocPlugin(protos => protos.map(proto => {
    console.error(`Working on ${proto.name}.`);
    // console.error(JSON.stringify(proto));
    return {
        name: `${proto.name}.json`,
        content: JSON.stringify(proto, null, 2)
    }
}))
    .then(() => {
        // I use error, because stdout is used for plugin
        console.error('Complete.')
    });


module.exports = {
    Template : require("./util/template"),
    comments : require("./util/comment-finder"),
};
