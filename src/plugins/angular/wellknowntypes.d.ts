declare namespace google.protobuf {
    type Any = {
        "@type": string;
        [index: string]: any
    };
    type Timestamp = string;
    type Duration = string;
    type Struct = { [index: string]: Value };
    type DoubleValue = number | 'NaN' | 'Infinity' | '-Infinity';
    type FloatValue = number | 'NaN' | 'Infinity' | '-Infinity';

    type Int32Value = number;
    type UInt32Value = number;

    type Int64Value = string;
    type UInt64Value = string;

    type BoolValue = boolean;
    type StringValue = string;
    type BytesValue = string;
    type Empty = {};
    type NullValue = null;
    type ListValue = Array<Value>;
    type Value = string | DoubleValue | boolean | ListValue | Struct | NullValue;
    type FieldMask = string;
}
