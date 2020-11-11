/* eslint-disable @typescript-eslint/naming-convention */
import { Component, ComponentAPI, Plugin, Variable, Subscribe } from '@ayanaware/bento';
import { Intern } from '../Intern';
import { InternVariable } from '../InternVariable';
import { Command } from './interfaces';
import { Byters } from '../byters';
import { ResponseOptions } from '@byters/brokers.js';

export class CommandManager implements Component {

	public name = 'CommandManager';
	public api!: ComponentAPI;
	public parent: Plugin = Intern;

	@Variable({ 'name': InternVariable.INTERN_COMMAND_PREFIX, 'default': '!' })
	public prefix!: string;

	@Variable({ 'name': InternVariable.INTERN_BOT_ID, 'default': null })
	public id!: string | null;

	private readonly commands: Map<string, Command> = new Map();
	private readonly aliases: Map<string, string> = new Map();

	/**
	 * @since 0.0.1
     * @public
	 */
	public async onChildLoad(entity: Command) {
		try {
			await this.addCommand(entity);
		} catch (e) {
			console.warn(e);
		}
	}

	/**
	 * @since 0.0.1
     * @public
	 */
	public async onChildUnload(entity: Command) {
		try {
			await this.removeCommand(entity);
		} catch (e) {
			console.warn(e);
		}
	}

	/**
	 * @since 0.0.1
     * @public
	 */
	public findCommand(commandAlias: string): Command|null {
		const alias = this.aliases.get(commandAlias);
		if (!alias) return null;

		const command = this.commands.get(alias);
		if (!command) throw new Error('Command with that alias could not be found.');

		return command;
	}

	/**
	 * @since 0.0.1
     * @private
	 */
	protected addCommand(command: Command) {
		if (typeof command.handle !== 'function') throw new Error('Command run method must be a function.');
		if (typeof command.options !== 'object') throw new Error('Command options must be an object.');
		if (this.commands.has(command.name)) throw new Error('Command already exists with this name.');

		const { options } = command;
		this.commands.set(command.name, command);

		if (options.aliases) {
			const clashes = options.aliases!.filter(alias => this.aliases.has(alias));
			if (clashes.length > 0) throw new Error('The alias already exists in a command.');

			options.aliases.push(command.name);
			for (let alias of options.aliases!) {
				alias = alias.toLowerCase();
				this.aliases.set(alias, command.name);
			}
		}
	}

	/**
	 * @since 0.0.1
     * @private
	 */
	protected removeCommand(command: Command|string) {
		if (typeof command === 'string') command = this.findCommand(command) as Command;
		if (!command) throw new Error('Could not find a command with that alias.');
	}

	@Subscribe(Byters, 'MESSAGE_CREATE')
	protected createMessage(data: unknown, { ack }: ResponseOptions) {
		ack();
		// todo: a lot of things
	}

}
