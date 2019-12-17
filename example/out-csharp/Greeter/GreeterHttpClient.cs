// <auto-generated>
//     Generated by the protocol buffer compiler plugin.  DO NOT EDIT!
//     source: greeter.proto
// </auto-generated>


using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using Google.Protobuf;
using Google.Protobuf.WellKnownTypes;

namespace Greeter
{

    /// <summary>
    /// This is just an example service that
    /// uses imports
    /// </summary>
    public class GreeterHttpClient
    {
        private readonly HttpClient _client;


        public GreeterHttpClient(HttpClient client)
        {
            client.DefaultRequestHeaders.Add("Accept", "application/protobuf");
            _client = client;
        }


		
        /// <summary>
        /// Simple hello method
        /// </summary>
        public async Task<global::Greeter.HelloResponse> Hello(global::Greeter.HelloRequest request, CancellationToken cancellationToken = default)
        {
            return await DoRequest(request, "greeter.Greeter/Hello", global::Greeter.HelloResponse.Parser, cancellationToken);
        }
		


        /// <summary>
        /// Simple ext method
        /// </summary>
        [global::System.Obsolete] public async Task<global::Ext.ExtResponse> Ext(global::Ext.ExtRequest request, CancellationToken cancellationToken = default)
        {
            return await DoRequest(request, "greeter.Greeter/Ext", global::Ext.ExtResponse.Parser, cancellationToken);
        }
		


        /// <summary>

        /// </summary>
        public async Task<global::Zett.ZettResponse> Zett(global::Zett.ZettRequest request, CancellationToken cancellationToken = default)
        {
            return await DoRequest(request, "greeter.Greeter/Zett", global::Zett.ZettResponse.Parser, cancellationToken);
        }
		


        /// <summary>

        /// </summary>
        public async Task<global::Zett.ZettResponse> Get(global::Google.Protobuf.WellKnownTypes.Int32Value request, CancellationToken cancellationToken = default)
        {
            return await DoRequest(request, "greeter.Greeter/Get", global::Zett.ZettResponse.Parser, cancellationToken);
        }
		


        private async Task<T> DoRequest<T>(IMessage request, string uri, MessageParser<T> responseParser, CancellationToken cancellationToken)
            where T : IMessage<T>
        {
            var requestMessage = new HttpRequestMessage(HttpMethod.Put, uri);
            requestMessage.Content = new ByteArrayContent(request.ToByteArray());
            requestMessage.Content.Headers.ContentType =
                MediaTypeHeaderValue.Parse($"application/protobuf; proto={request.Descriptor.FullName}");
            var response = await _client.SendAsync(requestMessage, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
            response.EnsureSuccessStatusCode();
            var responseStream = await response.Content.ReadAsStreamAsync();
            return responseParser.ParseFrom(responseStream);
        }



    }
}