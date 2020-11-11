import { Component, Entity } from '@ayanaware/bento';
import { CommandOptions } from './CommandOptions';

export interface Command extends Component {

	parent: Entity;
	options: CommandOptions;

	handle(...args: any): Promise<any>;
}
