import { FSComponentLoader, Plugin, PluginAPI } from '@ayanaware/bento';
import Byters from './byters';
import * as path from 'path';
import { mergeDefault } from '@sapphire/utilities';
import { defaults } from './constants';
import { Broker } from '@byters/brokers.js';

// TODO: Add version based on package.json
export class Intern<
	GW extends Broker<any, any>
> implements Plugin {

	public name = 'Intern';
	public api!: PluginAPI;

	public options: Options<GW>;

	public fsLoader!: FSComponentLoader;

	public constructor(options?: Options<GW>) {
		this.options = mergeDefault(defaults, options) as Options<GW>;
	}

	public setOptions(options: Options<GW>) {
		this.options = options;
		return this;
	}

	/**
	 * @since 0.0.1
	 */
	public async onLoad() {
		this.fsLoader = new FSComponentLoader();
		this.fsLoader.name = 'InternFSComponentLoader';
		await this.api.bento.addPlugin(this.fsLoader);

		const byters: Byters = await (this.fsLoader as any).createInstance(path.resolve(__dirname, 'byters'));
		await this.api.bento.addComponent(byters);

		await this.fsLoader.addDirectory(__dirname, 'commands');
	}

}

export interface BrokerOptions<B extends Broker<any, any> = Broker<any, any>> {
	instance: B;
	startParameters: Parameters<B['start']>;
}

export interface GatewayOptions<GW extends Broker<any, any> = Broker<any, any>> {
	broker: BrokerOptions<GW>;
}

export interface Options<GW extends Broker<any, any> = Broker<any, any>> {
	gateway: GatewayOptions<GW>;
	client?: ClientOptions;
}

export interface ClientOptions {
	prefix: string;
}
