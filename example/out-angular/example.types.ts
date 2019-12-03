// Generated code - do not edit!
import {google} from './wellknowntypes'


export interface BuiltInTypesMessage {

	bytesField?: google.protobuf.BytesValue;
	
	stringField?: string;
	
	int32Field?: google.protobuf.Int32Value;
	
	uint32Field?: google.protobuf.UInt32Value;
	
	int64Field?: google.protobuf.Int64Value;
	
	uint64Field?: google.protobuf.UInt64Value;
	
	boolField?: boolean;
	
	doubleField?: google.protobuf.DoubleValue;
	
	floatField?: google.protobuf.FloatValue;
	
	mapField?: { [index: string]: google.protobuf.Int32Value };
	
	otherMapField?: { [index: number]: BuiltInTypesMessage };
	
	repeatedStringsField?: Array<string>;
	
	repeatedInt32Field?: Array<google.protobuf.Int32Value>;
	
	repeatedBoolField?: Array<boolean>;
	
	pkgEnumField?: 'PKG_A' | 'PKG_B' | 'PKG_C';
	
	msgEnumField?: 'MSG_A' | 'MSG_B' | 'MSG_C';
	
}



export interface WellKnownTypesMessage {

	anyField?: google.protobuf.Any;
	
	durationField?: google.protobuf.Duration;
	
	emptyField?: google.protobuf.Empty;
	
	structField?: google.protobuf.Struct;
	
	timestampField?: google.protobuf.Timestamp;
	
	doubleField?: google.protobuf.DoubleValue;
	
	floatField?: google.protobuf.FloatValue;
	
	int64Field?: google.protobuf.Int64Value;
	
	uint64Field?: google.protobuf.UInt64Value;
	
	int32Field?: google.protobuf.Int32Value;
	
	uint32Field?: google.protobuf.UInt32Value;
	
	boolField?: google.protobuf.BoolValue;
	
	stringField?: google.protobuf.StringValue;
	
	bytesField?: google.protobuf.BytesValue;
	
}

