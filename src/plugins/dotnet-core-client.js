const Plugin = require('../plugin');
const comments = require('../util/comment-finder');
const Template = require('../util/template');


class DotnetCoreClient extends Plugin {


    renderService(proto, service, serviceIndex) {
        const methods = service.getMethodList().filter(method => {
            return !method.getClientStreaming()
                && !method.getServerStreaming()
        });
        const vars = {
            '@@PROTO_FILE@@': proto.getName(),
            '@SERVICE@': `${proto.getPackage()}.${service.getName()}`,
            '@NAMESPACE@': proto.getOptions().getCsharpNamespace(),
            '@CLASS@': service.getName() + 'Client',
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
                '@METHOD_DEPRECATED@': deprecated ? "[Obsolete] " : ''
            });
        });
        template.replace(vars);
        const file = proto.getOptions().getCsharpNamespace().split('.').join('/') + '/' + service.getName() + 'Client.cs';
        this.addResponseFile(file, template.toString());
    }

}


module.exports = DotnetCoreClient;

