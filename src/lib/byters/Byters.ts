import { Component, ComponentAPI, Inject, PluginReference } from '@ayanaware/bento';
import { Broker, Brokers } from '@byters/brokers.js';
import { GatewayDispatchEvents } from 'discord-api-types';
import * as path from 'path';
import { Intern } from '../Intern';
import { extractEventSubscriptions } from '../utils/extractEventSubscriptions';
import { Rest } from './rest';

export class Byters implements Component {

	public name = 'Byters';
	public api!: ComponentAPI;
	public parent: PluginReference = Intern;

	public gateway!: Brokers;

	@Inject() private intern!: Intern<Broker<any, any>>;

	private gatewayEvents: Set<string> = new Set();

	public async onLoad() {
		await this.connectGateway();
	}

	/**
	 * @since 0.0.1
	 * @description Connects to the gateway using the broker and susbcribes to used gateway events.
	 */
	public async connectGateway() {
		this.gateway = new Brokers(this.intern.options.gateway.broker.instance);

		this.api.forwardEvents(
			this.gateway,
			Object.values(GatewayDispatchEvents)
		);
		this.gatewayEvents = extractEventSubscriptions(this.name, this.api);

		await this.gateway.start(...this.intern.options.gateway.broker.startParameters);

		await this.gateway.subscribe([
			...this.gatewayEvents
		]);
	}

	public async loadRest() {
		const rest: Rest = await (this.intern.fsLoader as any).createInstance(path.resolve(__dirname, 'rest'));
		await this.intern.api.bento.addComponent(rest);
	}

}
