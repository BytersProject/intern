/* eslint-disable @typescript-eslint/naming-convention */
import { Component, ComponentAPI, Plugin, Variable, Subscribe } from '@ayanaware/bento';
import { Intern } from '../Intern';
import { InternVariable } from '../InternVariable';
import { Command } from './Command';
import { Byters } from '../byters';
import { ResponseOptions } from '@byters/brokers.js';
import { mergeDefault } from '@sapphire/utilities';
import { commandOptionDefaults } from '../constants';
import { APIMessage, GatewayDispatchEvents } from 'discord-api-types';
import { CommandContext } from './CommandContext';

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
		if (typeof command.run !== 'function') throw new Error('Command run method must be a function.');
		if (typeof command.options !== 'object') throw new Error('Command options must be an object.');
		if (this.commands.has(command.name)) throw new Error('Command already exists with this name.');

		const options = mergeDefault(commandOptionDefaults, command.options);

		const clashes = options.aliases!.filter(alias => this.aliases.has(alias));
		if (clashes.length > 0) throw new Error('The alias already exists in a command.');

		options.aliases.push(command.name);
		for (let alias of options.aliases) {
			alias = alias.toLowerCase();
			this.aliases.set(alias, command.name);
		}

		command.options = options;

		this.commands.set(command.name, command);
	}

	/**
	 * @since 0.0.1
     * @private
	 */
	protected removeCommand(command: Command|string) {
		if (typeof command === 'string') command = this.findCommand(command) as Command;
		if (!command) throw new Error('Could not find a command with that alias.');
	}

	@Subscribe(Byters, GatewayDispatchEvents.MessageCreate)
	protected async createMessage(data: APIMessage, { ack }: ResponseOptions) {
		ack();
		const prefixes = this.prefix;
		const parsedPrefix = this.getPrefix(data.content, prefixes);
		if (parsedPrefix === null) return null;

		const prefixLess = data.content.slice(parsedPrefix.length).trim();
		const spaceIndex = prefixLess.indexOf(' ');
		const name = spaceIndex === -1 ? prefixLess : prefixLess.slice(0, spaceIndex);

		const command = this.findCommand(name);
		// todo: no command found handler
		if (command === null) return null;

		const parameters = spaceIndex === -1 ? '' : prefixLess.substr(spaceIndex + 1).trim();

		const args = await command.preParse(data, parameters);

		const ctx = new CommandContext(command, data, args);
		await command.run(ctx, args);
	}

	private getPrefix(content: string, prefixes: readonly string[] | string | null): string | null {
		if (prefixes === null) return null;
		if (typeof prefixes === 'string') return content.startsWith(prefixes) ? prefixes : null;
		return prefixes.find(prefix => content.startsWith(prefix)) ?? null;
	}

}
