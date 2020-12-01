/* eslint-disable @typescript-eslint/naming-convention */
import { APIMessage } from 'discord-api-types';
import { Args } from '../arguments/Args';
import { Byters } from '../byters';
import { Command } from './Command';

export class CommandContext {

	public readonly command: Command;

	public readonly data: APIMessage;

	public readonly args: Args;

	public readonly byters: Byters;

	public constructor(command: Command, data: APIMessage, args: Args) {
		this.command = command;
		this.data = data;
		this.args = args;

		this.byters = this.command.api.getEntity(Byters);
	}

}
