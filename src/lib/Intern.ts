import { FSComponentLoader, Plugin, PluginAPI } from '@ayanaware/bento';
import Byters from './byters';
import * as path from 'path';
import { Broker } from '@byters/brokers.js';

// TODO: Add version based on package.json
export class Intern<B extends Broker<any, any>> implements Plugin {

	public name = 'Intern';
	public api!: PluginAPI;

	public options: Options<B>;

	public fsLoader!: FSComponentLoader;

	public constructor(options: Options<B>) {
		this.options = options;
	}


	public async onLoad() {
		this.fsLoader = new FSComponentLoader();
		this.fsLoader.name = 'InternFSComponentLoader';
		await this.api.bento.addPlugin(this.fsLoader);

		const byters: Byters = await (this.fsLoader as any).createInstance(path.resolve(__dirname, 'byters'));
		await this.api.bento.addComponent(byters);
	}

}

export interface BrokerOptions<B extends Broker<any, any> = Broker<any, any>> {
	constructorParams?: any[];
	startParameters: Parameters<B['start']>;
}

export interface GatewayOptions<B extends Broker<any, any> = Broker<any, any>> {
	broker: BrokerOptions<B>;
}

export interface Options<B extends Broker<any, any> = Broker<any, any>> {
	gateway: GatewayOptions<B>;
}
