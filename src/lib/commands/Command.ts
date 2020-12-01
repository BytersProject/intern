import { Component, ComponentAPI, Entity, Inject } from '@ayanaware/bento';
import { APIMessage } from 'discord-api-types';
import * as Lexure from 'lexure';
import { Args } from '../arguments/Args';
import { ArgumentManager } from '../arguments/ArgumentManager';
import { Awaited } from '../utils/Types';
import { CommandContext } from './CommandContext';
import { CommandManager } from './CommandManager';
import { CommandOptions } from './interfaces/CommandOptions';

export abstract class Command implements Component {

	public abstract name: string;

	public api!: ComponentAPI;
	public parent: Entity = CommandManager;
	public options?: CommandOptions;

	@Inject() public argumentManager!: ArgumentManager;

	private lexer = new Lexure.Lexer();

	public constructor() {
		this.lexer.setQuotes([
			['"', '"'],
			['“', '”'],
			['「', '」']
		]);
	}

	public preParse(data: APIMessage, parameters: string): Awaited<Args> {
		const parser = new Lexure.Parser(this.lexer.setInput(parameters).lex());
		const args = new Lexure.Args(parser.parse());
		return new Args(data, this, args);
	}

	public abstract run(ctx: CommandContext, args: Args): Awaited<any>;

}
