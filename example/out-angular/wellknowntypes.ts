export namespace google.protobuf {
    export type Any = {
        "@type": string;
        [index: string]: any
    };
    export type Timestamp = string;
    export type Duration = string;
    export type Struct = { [index: string]: Value };
    export type DoubleValue = number | 'NaN' | 'Infinity' | '-Infinity';
    export type FloatValue = number | 'NaN' | 'Infinity' | '-Infinity';

    export type Int32Value = number;
    export type UInt32Value = number;

    export type Int64Value = string;
    export type UInt64Value = string;

    export type BoolValue = boolean;
    export type StringValue = string;
    export type BytesValue = string;
    export type Empty = {};
    export type NullValue = null;
    export interface ListValue extends Array<Value> {}
    export type Value = string | DoubleValue | boolean | ListValue | Struct | NullValue;
    export type FieldMask = string;
}
