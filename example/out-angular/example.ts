// Generated code - do not edit!
import {Observable} from 'rxjs'
import {ExtRequest} from './ext'
import {ExtResponse} from './ext'
import {ZettRequest} from './zett'
import {ZettResponse} from './zett'
import {google} from './wellknowntypes'


export interface HelloRequest {

	name?: string;
	
}



export interface HelloResponse {

	greeting?: string;
	
}



/**
 * This is just an example service that
 * uses imports
 */
export interface GreeterInterface {

	/**
	 * Simple hello method
	 */
	hello(request: HelloRequest): Observable<HelloResponse>;

	/**
	 * Simple ext method
	 * 
	 * @deprecated
	 */
	ext(request: ExtRequest): Observable<ExtResponse>;

	zett(request: ZettRequest): Observable<ZettResponse>;

	get(request: google.protobuf.Int32Value): Observable<ZettResponse>;

}

