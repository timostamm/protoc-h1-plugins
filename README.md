Protobuf RPC over HTTP 1
========================

Supports all unary RPC calls over HTTP 1. 

Generates clients for:
- .NET Core 3

Supports server for:
- PHP via https://github.com/timostamm/protoc-h1-php-server



### Examples

Generate dotnet client:

```shell script
protoc --proto_path=example/protos \
    --plugin=src/protoc-gen-h1c-dotnetcore \
    --h1c-dotnetcore_out=example/out-csharp \
    example/protos/*.proto
```


Generate all csharp code, php service interface: 

```shell script
protoc --proto_path=example/protos \
    --plugin=src/protoc-gen-h1c-dotnetcore \
    --h1c-dotnetcore_out=example/out-csharp \
    --php_out=example/out-php \
    --csharp_out=example/out-csharp \
    example/protos/*.proto

```




### TODO

Support HTTP configuration via annotations:

https://github.com/googleapis/googleapis/blob/master/google/api/http.proto

https://github.com/googleapis/googleapis/blob/master/google/api/annotations.proto

Implement angular client.

Implement PHP client? 
