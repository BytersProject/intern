/* eslint-disable @typescript-eslint/naming-convention */
import { Component, ComponentAPI, PluginReference } from '@ayanaware/bento';
import Intern from '../..';
import { Argument } from './Argument';

export class ArgumentManager implements Component {

	public name = 'ArgumentManager';
	public api!: ComponentAPI;
	public parent: PluginReference = Intern;

	private readonly arguments: Map<string, Argument> = new Map();
	private readonly aliases: Map<string, string> = new Map();

	public async onChildLoad(entity: Argument) {
		try {
			await this.addArgument(entity);
		} catch (e) {
			console.warn(e);
		}
	}

	// TODO(QuantumlyTangled): Make argument name handling case insensitive
	public findArgument(argumentAlias: string): Argument | null {
		const alias = this.aliases.get(argumentAlias);
		if (!alias) return null;

		const argument = this.arguments.get(alias);
		if (!argument) throw new Error('Argument with that alias could not be found.');

		return argument;
	}

	// TODO(QuantumlyTangled): Make argument name handling case insensitive
	protected addArgument(argument: Argument) {
		if (this.arguments.has(argument.name)) throw new Error('Argument already exists with this name.');

		const { options } = argument;
		const aliases = options?.aliases ?? [];

		const clashes = aliases.filter((alias: string) => this.aliases.has(alias));
		if (clashes.length > 0) throw new Error('The alias already exists in a command.');

		aliases.push(argument.name);
		for (let alias of aliases) {
			alias = alias.toLowerCase();
			this.aliases.set(alias, argument.name);
		}

		this.arguments.set(argument.name, argument);
	}

}
