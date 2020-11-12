import { Component, Entity } from '@ayanaware/bento';
import { CommandOptions } from './CommandOptions';

export interface Command extends Component {

	parent: Entity;
	options: CommandOptions;

	run(...args: any): Promise<any>;
}
