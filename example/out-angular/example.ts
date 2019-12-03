// Generated code - do not edit!
import {ExtRequest} from './ext'
import {ExtResponse} from './ext'
import {ZettRequest} from './zett'
import {ZettResponse} from './zett'
import './wellknowntypes'


export interface HelloRequest {

	name: string;
	
}



export interface HelloResponse {

	greeting: string;
	
}



/**
 * This is just an example service that
 * uses imports
 */
export interface GreeterInterface {

	/**
	 * Simple hello method
	 */
	hello(request: HelloRequest): Promise<HelloResponse>;

	/**
	 * Simple ext method
	 * 
	 * @deprecated
	 */
	ext(request: ExtRequest): Promise<ExtResponse>;

	zett(request: ZettRequest): Promise<ZettResponse>;

	get(request: google.protobuf.Int32Value): Promise<ZettResponse>;

}

