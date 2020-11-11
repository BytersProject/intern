import { Component, Entity } from '@ayanaware/bento';
import { EventOptions } from './EventOptions';

export interface Event extends Component {
	parent: Entity;
	options: EventOptions;
	id: number;

	handle(...args: any): Promise<any>;
}
