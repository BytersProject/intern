import { APIMessage } from 'discord-api-types';
import { Command } from '../../commands';

export interface ArgumentContext extends Record<PropertyKey, unknown> {
	data: APIMessage;
	command: Command;

	minimum?: number;
	maximum?: number;
}
