Protobuf RPC over HTTP 1
========================

Supports all unary RPC calls over HTTP 1. 

Generates clients for:
- .NET Core 3

Supports server for:
- PHP via https://github.com/timostamm/protoc-h1-php-server



### Usage


Run `npm install protoc-h1-plugins` to install the plugins. 


Generate dotnet client:

```shell script
protoc --proto_path=example/protos \
    --plugin=node_modules/.bin/protoc-gen-h1c-dotnetcore \
    --h1c-dotnetcore_out=example/out-csharp \
    --csharp_opt=base_namespace= \
    example/protos/*.proto
```


Generate all csharp code, php service interface: 

```shell script
protoc --proto_path=example/protos \
    --plugin=node_modules/.bin/protoc-gen-h1c-dotnetcore \
    --h1c-dotnetcore_out=example/out-csharp \
    --php_out=example/out-php \
    --csharp_out=example/out-csharp \
    --csharp_opt=base_namespace= \
    example/protos/*.proto
```


### TODO

* C# client: Client-wide option to send binary or json.

* C# client: Client-wide option: factory for accept headers, taking proto and bin/json flag as argument, returning enumerable of acceptable type (and quality), validate response. 

* C# client: Default accept headers factory: 
  
  When sending binary: application/protobuf; proto=..., application/protobuf, application/json; proto=..., application/json
  
  When sending json: application/json; proto=..., application/json, application/protobuf; proto=..., application/protobuf

* C# client: Always POST.

* Support HTTP configuration via annotations:
  
  https://github.com/googleapis/googleapis/blob/master/google/api/http.proto
  
  https://github.com/googleapis/googleapis/blob/master/google/api/annotations.proto

* Implement angular client.

* Implement PHP client? 
