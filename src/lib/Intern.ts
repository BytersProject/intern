import { FSComponentLoader, Plugin, PluginAPI } from '@ayanaware/bento';
import Byters from './byters';
import * as path from 'path';
import { mergeDefault } from '@sapphire/utilities';
import { internOptionDefaults } from './constants';
import { Broker } from '@byters/brokers.js';
import { CommandManager } from '..';
import EventManager from './events';

// TODO: Add version based on package.json
export class Intern<GW extends Broker<any, any>> implements Plugin {

	public name = 'Intern';
	public api!: PluginAPI;

	public options: Options<GW>;

	public fsLoader!: FSComponentLoader;

	public constructor(options?: Options<GW>) {
		this.options = mergeDefault(internOptionDefaults as any, options) as Options<GW>;
	}

	/**
	 * Replaces the currently stored options at {@link Intern.options}.
	 * @param options The options which should overwrite {@link Intern.options}.
	 * @since 0.0.1
	 */
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

		const commandManager: CommandManager = await (this.fsLoader as any).createInstance(path.resolve(__dirname, 'commands'));
		await this.api.bento.addComponent(commandManager);

		const eventManager: EventManager = await (this.fsLoader as any).createInstance(path.resolve(__dirname, 'events'));
		await this.api.bento.addComponent(eventManager);

	}

}

/**
 * @since 0.0.1
 */
export interface BrokerOptions<B extends Broker<any, any> = Broker<any, any>> {
	/**
	 * @since 0.0.1
	 */
	instance: B;
	/**
	 * @since 0.0.1
	 */
	startParameters: Parameters<B['start']>;
}

/**
 * @since 0.0.1
 */
export interface GatewayOptions<GW extends Broker<any, any> = Broker<any, any>> {
	/**
	 * @since 0.0.1
	 */
	broker: BrokerOptions<GW>;
}

/**
 * @since 0.0.1
 */
export interface ClientOptions {
	/**
	 * @since 0.0.1
	 */
	prefix: string;
}

/**
 * @since 0.0.1
 */
export interface Options<GW extends Broker<any, any> = Broker<any, any>> {
	/**
	 * @since 0.0.1
	 */
	gateway: GatewayOptions<GW>;
	/**
	 * @since 0.0.1
	 */
	client?: ClientOptions;
}
