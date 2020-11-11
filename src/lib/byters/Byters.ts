import { Component, ComponentAPI, Inject, PluginReference } from '@ayanaware/bento';
import { Broker, Brokers } from '@byters/brokers.js';
import { GatewayDispatchEvents } from 'discord-api-types';
import { Intern } from '../Intern';
import { InternVariable } from '../InternVariable';
import { extractEventSubscriptions } from '../utils/extractEventSubscriptions';

export class Byters implements Component {

	public name = 'Byters';
	public api!: ComponentAPI;
	public parent: PluginReference = Intern;

	public gateway!: Brokers;

	@Inject(Intern) private intern!: Intern<Broker<any, any>>;

	private gatewayEvents: Set<string> = new Set();

	public async onLoad() {
		await this.connectGateway();
	}

	public async connectGateway() {
		const gatewayBroker = this.api.getVariable({
			name: InternVariable.INTERN_GATEWAY_BROKER
		}) as Broker<any, any> | typeof Broker;
		this.gateway = new Brokers(
			typeof (gatewayBroker as any).prototype === 'undefined'
				// @ts-expect-error This expression is not constructable. Not all constituents of type 'Broker<any, any, ResponseOptions<unknown>> | typeof Broker' are constructable. Type 'Broker<any, any, ResponseOptions<unknown>>' has no construct signatures.ts(2351)
				? new gatewayBroker(...this.intern.options.gateway.broker.constructorParams)
				: gatewayBroker
		);

		this.api.forwardEvents(this.gateway, Object.keys(GatewayDispatchEvents));
		this.gatewayEvents = extractEventSubscriptions('Byters', this.api);

		await this.gateway.start(...this.intern.options.gateway.broker.startParameters);

		await this.gateway.subscribe([
			...this.gatewayEvents
		]);
	}

}
