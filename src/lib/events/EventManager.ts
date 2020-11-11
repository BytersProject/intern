/* eslint-disable @typescript-eslint/naming-convention */
import { Component, ComponentAPI, Plugin } from '@ayanaware/bento';
import { Byters } from '../byters';
import { Event } from './interfaces';
import { GatewayDispatchEvents } from 'discord-api-types';

export class EventManager implements Component {

	public name = 'EventManager';
	public api!: ComponentAPI;
	public parent: Plugin = Byters;

	private readonly events: Map<string, Event> = new Map();

	public async onChildLoad(entity: Event) {
		try {
			await this.addEvent(entity);
		} catch (e) {
			console.warn(e);
		}
	}

	public async onChildUnload(entity: Event) {
		try {
			await this.removeEvent(entity);
		} catch (e) {
			console.warn(e);
		}
	}

	/**
	 * @since 0.0.1
     * @private
	 */
	protected addEvent(event: Event) {
		if (typeof event.handle !== 'function') throw new Error('Event run must be a function.');
		if (typeof event.options !== 'object') throw new Error('Event options must be an object.');
		if (this.events.has(event.name)) throw new Error('Event already exists with this name.');

		if (!event.options.event) event.options.event = event.name as GatewayDispatchEvents;

		// TODO(QuantumlyTangled): Refactor (https://www.youtube.com/watch?v=SETnK2ny1R0)
		const id = this.api.subscribe(Byters, event.options.event, (...args: any[]) => event.handle(...args));
		event.id = id;

		this.events.set(event.name, event);
	}

	/**
	 * @since 0.0.1
     * @private
	 */
	protected removeEvent(event: Event) {
		if (!this.events.has(event.name)) throw new Error('This event is not loaded.');
		if (!event.id) throw new Error('This event does not contain an id');

		this.api.unsubscribe(Byters, event.id);

		this.events.delete(event.name);
	}

}
