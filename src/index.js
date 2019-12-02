module.exports = {
    Plugin: require("./util/plugin"),
    Template: require("./util/template"),
    comments: require("./util/comment-finder"),
    DotnetCoreClient: require("./plugins/dotnet-core/dotnet-core-client"),
    AngularClient: require("./plugins/angular/AngularClient"),
};
