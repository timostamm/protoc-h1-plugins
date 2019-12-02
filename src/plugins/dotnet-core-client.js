const Plugin = require('../util/plugin');
const comments = require('../util/comment-finder');
const Template = require('../util/template');


class DotnetCoreClient extends Plugin {


    handleService(proto, service, serviceIndex) {
        const methods = service.getMethodList().filter(method => {
            return !method.getClientStreaming()
                && !method.getServerStreaming()
        });
        const vars = {
            '@@PROTO_FILE@@': proto.getName(),
            '@SERVICE@': `${proto.getPackage()}.${service.getName()}`,
            '@NAMESPACE@': proto.getOptions().getCsharpNamespace(),
            '@CLASS@': `${service.getName()}HttpClient`,
            '@CLASS_COMMENT@': comments.service(proto, serviceIndex, "    /// ")
        };
        const template = Template.read(`${__dirname}/dotnet-core-client.template`);
        template.repeatSection('@BEGIN_METHOD@', '@END_METHOD@', methods, (method, tpl) => {
            const deprecated = method.getOptions() && method.getOptions().getDeprecated();
            tpl.replace(vars);
            tpl.replace({
                '@METHOD@': method.getName(),
                '@@REQUEST@@': this.findMessageTypeCsharp(method.getInputType()),
                '@RESPONSE@': this.findMessageTypeCsharp(method.getOutputType()),
                '@METHOD_COMMENT@': comments.serviceMethod(proto, serviceIndex, method.getName(), "        /// "),
                '@METHOD_DEPRECATED@': deprecated ? "[global::System.Obsolete] " : ''
            });
        });
        template.replace(vars);
        const packageDir = proto.getOptions().getCsharpNamespace().split('.').join('/');
        const file = `${packageDir}/${service.getName()}HttpClient.cs`;
        this.addResponseFile(file, template.toString());
    }

}


module.exports = DotnetCoreClient;

