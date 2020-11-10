import { Component, ComponentAPI, /* Inject, */ PluginReference, Subscribe } from '@ayanaware/bento';
import { EntityEvents, EntityEventSubscription } from '@ayanaware/bento/build/entities/internal/EntityEvents';
import { Brokers } from '@byters/brokers.js';
import { AMQpBroker } from '@byters/brokers.js-amqp';
import { Intern } from '../Intern';

export class Byters implements Component {

	public name = 'Byters';
	public api!: ComponentAPI;
	public parent: PluginReference = Intern;

	public gateway!: Brokers;

	// @Inject(Intern) private intern: Intern;

	private gatewayEvents: Set<string> = new Set();

	public async onLoad() {
		await this.connectGateway();
	}

	public async connectGateway() {
		// TODO(QuantumlyTangled): Allow custom broker
		this.gateway = new Brokers(new AMQpBroker('gatewaygo', {
			exchange: {
				durable: true
			}
		}));

		this.api.forwardEvents(this.gateway, [
			'MESSAGE_CREATE'
		]);

		await this.gateway.start('localhost:32779');

		// Definitely refactor this once it becomes "official"
		// In the event that you need motivation feel free to listen to https://www.youtube.com/watch?v=SETnK2ny1R0
		// #region Shady shady code
		const entityEvents = (this.api as any).bento.entities.events.get('Byters') as EntityEvents;
		if (!entityEvents) return;

		for (const [, subscription] of ((entityEvents as any).subscriptions as Map<number, EntityEventSubscription>)) {
			this.gatewayEvents.add(subscription.name);
		}
		// #endregion Shady shady code

		await this.gateway.subscribe([
			...this.gatewayEvents
		]);
	}

	@Subscribe(Byters, 'MESSAGE_CREATE')
	public handleMessageCreate(data: any, { ack }: { ack: any }) {
		ack();
		console.log(data);
	}

}
