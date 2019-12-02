// Generated code - do not edit!
import './ext';
import './zett';


declare namespace example {


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
		hello(request: example.HelloRequest): Promise<example.HelloResponse>;
	
		/**
		 * Simple ext method
		 * 
		 * @deprecated
		 */
		ext(request: ext.ExtRequest): Promise<ext.ExtResponse>;
	
		zett(request: zett.ZettRequest): Promise<zett.ZettResponse>;
	
	}
	


}
