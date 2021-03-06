// Generated code - do not edit!
import {Observable} from 'rxjs'
import {HttpClient} from '@angular/common/http'
import {ExtRequest} from './ext'
import {ExtResponse} from './ext'
import {ZettRequest} from './zett'
import {ZettResponse} from './zett'
import {google} from './wellknowntypes'


/**
 *  Comment on message HelloRequest
 */
export interface HelloRequest {

	/** Comment on field HelloRequest.name */
	name?: string; // Trailing comment on field HelloRequest.name
	
}



export interface HelloResponse {

	greeting?: string;
	
}



/**
 * This is just an example service that
 * uses imports
 */
export class GreeterHttpClient {

	constructor(private readonly endpoint: string, private readonly client: HttpClient) {
	}


	/**
	 * Simple hello method
	 */
	hello(request: HelloRequest): Observable<HelloResponse> {
		const url = this.endpoint + 'greeter.Greeter/Hello';
		return this.client.post<HelloResponse>(url, request);
	}

	/**
	 * Simple ext method
	 * 
	 * @deprecated
	 */
	ext(request: ExtRequest): Observable<ExtResponse> {
		const url = this.endpoint + 'greeter.Greeter/Ext';
		return this.client.post<ExtResponse>(url, request);
	}

	zett(request: ZettRequest): Observable<ZettResponse> {
		const url = this.endpoint + 'greeter.Greeter/Zett';
		return this.client.post<ZettResponse>(url, request);
	}

	get(request: google.protobuf.Int32Value): Observable<ZettResponse> {
		const url = this.endpoint + 'greeter.Greeter/Get';
		return this.client.post<ZettResponse>(url, request);
	}

}

