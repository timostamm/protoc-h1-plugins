Protobuf RPC over HTTP 1
========================

Supports all unary RPC calls over HTTP 1. 

Generates clients for:
- .NET Core 3
- Angular (tested with Angular 6)

Supports server for:
- PHP via https://github.com/timostamm/protoc-h1-php-server

Default values in JSON:
The typescript typings assume that default values are *not* included in JSON. 
As of now (dec 2019), protobuf PHP does not support this feature, see https://github.com/protocolbuffers/protobuf/issues/6035


## Usage

#### PHP server

Generate PHP classes for PHP server, includes interface for service 
and PHP classes for the protobuf types:

```shell script
protoc --proto_path=example/protos \
    --php_out=example/out-php \
    example/protos/*.proto
```

Use `timostamm/protoc-h1-php-server` to serve.
 

#### dotnet client for the PHP server

Run `npm install protoc-h1-plugins` to install the plugins. 
Generate C# code for the protobuf types and the dotnet client:

```shell script
protoc --proto_path=example/protos \
    --plugin=node_modules/.bin/protoc-gen-h1c-dotnetcore \
    --h1c-dotnetcore_out=example/out-csharp \
    --csharp_opt=base_namespace= \
    --csharp_out=example/out-csharp \
    --csharp_opt=base_namespace= \
    example/protos/*.proto
```


#### angular client for the PHP server

Generates typescript interfaces for all protobuf messages, 
generates client using angular´s http client.

```shell script
protoc --proto_path=example/protos \
    --plugin=node_modules/.bin/protoc-gen-h1c-angular \
    --h1c-angular_out=example/out-angular \
    example/protos/*.proto
```


#### angular client for the PHP server



### TODO


* Support typescript typings for JSON with included default values, once PHP supports outputting them:
  - int32, uint32, int64, uint64, double, float: always present, default value 0
  - bytes: always present, default value ""
  - bool: always present, default value false
  - map: always present, default value {}
  - repeated fields: always present, default value []
  - message fields: always present, default value null
  - enum fields: always present, default value = name of first enum value (string)

* C# client: Client-wide option to send binary or json.

* C# client: Client-wide option: factory for accept headers, taking proto and bin/json flag as argument, returning enumerable of acceptable type (and quality), validate response. 

* C# client: Default accept headers factory: 
  
  When sending binary: application/protobuf; proto=..., application/protobuf, application/json; proto=..., application/json
  
  When sending json: application/json; proto=..., application/json, application/protobuf; proto=..., application/protobuf

* C# client: Always POST.

* Support HTTP configuration via annotations:
  
  https://github.com/googleapis/googleapis/blob/master/google/api/http.proto
  
  https://github.com/googleapis/googleapis/blob/master/google/api/annotations.proto

* Implement PHP client? 
