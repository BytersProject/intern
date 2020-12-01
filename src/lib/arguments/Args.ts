/* eslint-disable @typescript-eslint/naming-convention */

/*
	This file has been adopted from sapphire-project/framework (https://github.com/sapphire-project/framework/blob/677b95355c6fe23ea632b127af837a7a9af4077d/src/lib/utils/Args.ts)
	Copyright © 2018-2020 The Sapphire Project and its contributors
*/

import { APIMessage } from 'discord-api-types';
import type * as Lexure from 'lexure';
import { Command } from '../commands';
import { ArgumentError } from '../errors/ArgumentError';
import { UserError } from '../errors/UserError';
import { IArgument } from './Argument';
import { ArgumentType, ArgumentContext } from './interfaces';
import { err, isErr, isOk, ok, Ok, Result } from './Result';

export class Args {

	public readonly data: APIMessage;
	public readonly command: Command;

	private readonly parser: Lexure.Args;
	private states: Lexure.ArgsState[] = [];

	public constructor(data: APIMessage, command: Command, parser: Lexure.Args) {
		this.data = data;
		this.command = command;
		this.parser = parser;
	}

	public start(): Args {
		this.parser.state = {
			usedIndices: new Set(),
			position: 0,
			positionFromEnd: this.parser.parserOutput.ordered.length - 1
		};
		return this;
	}

	public async pickResult<T>(type: IArgument<T>, options?: ArgOptions): Promise<Result<T, UserError>>;
	public async pickResult<K extends keyof ArgumentType>(type: K, options?: ArgOptions): Promise<Result<ArgumentType[K], UserError>>;
	public async pickResult<K extends keyof ArgumentType>(type: K, options: ArgOptions = {}): Promise<Result<ArgumentType[K], UserError>> {
		const argument = this.resolveArgument(type);
		if (!argument) return err(new UserError('UnavailableArgument', `The argument "${type as string}" was not found.`));

		// eslint-disable-next-line @typescript-eslint/require-await
		const result = await this.parser.singleParseAsync(async arg =>
			argument.run(arg, {
				data: this.data,
				command: this.command,
				...options
			}));
		if (result === null) return err(new UserError('MissingArguments', 'There are no more arguments.'));
		if (isOk(result)) return result as Ok<ArgumentType[K]>;
		return result;
	}

	public async pick<T>(type: IArgument<T>, options?: ArgOptions): Promise<T>;
	public async pick<K extends keyof ArgumentType>(type: K, options?: ArgOptions): Promise<ArgumentType[K]>;
	public async pick<K extends keyof ArgumentType>(type: K, options?: ArgOptions): Promise<ArgumentType[K]> {
		const result = await this.pickResult(type, options);
		if (isOk(result)) return result.value;
		throw result.error;
	}


	public async restResult<T>(type: IArgument<T>, options?: ArgOptions): Promise<Result<T, UserError>>;
	public async restResult<K extends keyof ArgumentType>(type: K, options?: ArgOptions): Promise<Result<ArgumentType[K], UserError>>;
	public async restResult<T>(type: keyof ArgumentType | IArgument<T>, options: ArgOptions = {}): Promise<Result<unknown, UserError>> {
		const argument = this.resolveArgument(type);
		if (!argument) return err(new UserError('UnavailableArgument', `The argument "${type as string}" was not found.`));

		if (this.parser.finished) return err(new UserError('MissingArguments', 'There are no more arguments.'));

		const state = this.parser.save();
		const data = this.parser.many().reduce((acc, token) => `${acc}${token.value}${token.trailing}`, '');
		const result = await argument.run(data, {
			data: this.data,
			command: this.command,
			...options
		});
		if (isOk(result)) return result;

		this.parser.restore(state);
		return result;
	}

	public async rest<T>(type: IArgument<T>, options?: ArgOptions): Promise<T>;
	public async rest<K extends keyof ArgumentType>(type: K, options?: ArgOptions): Promise<ArgumentType[K]>;
	public async rest<K extends keyof ArgumentType>(type: K, options?: ArgOptions): Promise<ArgumentType[K]> {
		const result = await this.restResult(type, options);
		if (isOk(result)) return result.value;
		throw result.error;
	}

	public async repeatResult<T>(type: IArgument<T>, options?: RepeatArgOptions): Promise<Result<T[], UserError>>;
	public async repeatResult<K extends keyof ArgumentType>(type: K, options?: RepeatArgOptions): Promise<Result<ArgumentType[K][], UserError>>;
	public async repeatResult<K extends keyof ArgumentType>(type: K, options: RepeatArgOptions = {}): Promise<Result<ArgumentType[K][], UserError>> {
		const argument = this.resolveArgument(type);
		if (!argument) return err(new UserError('UnavailableArgument', `The argument "${type as string}" was not found.`));

		if (this.parser.finished) return err(new UserError('MissingArguments', 'There are no more arguments.'));

		const output: ArgumentType[K][] = [];
		for (let i = 0, times = options.times ?? Infinity; i < times; i++) {
			// eslint-disable-next-line @typescript-eslint/require-await
			const result = await this.parser.singleParseAsync(async arg =>
				argument.run(arg, {
					data: this.data,
					command: this.command,
					...options
				}));
			if (result === null) break;
			if (isErr(result)) {
				if (output.length === 0) return result;
				break;
			}

			output.push(result.value as ArgumentType[K]);
		}

		return ok(output);
	}

	public async repeat<T>(type: IArgument<T>, options?: RepeatArgOptions): Promise<T[]>;
	public async repeat<K extends keyof ArgumentType>(type: K, options?: RepeatArgOptions): Promise<ArgumentType[K][]>;
	public async repeat<K extends keyof ArgumentType>(type: K, options?: RepeatArgOptions): Promise<ArgumentType[K][]> {
		const result = await this.repeatResult(type, options);
		if (isOk(result)) return result.value;
		throw result.error;
	}


	public getFlags(...keys: readonly string[]) {
		return this.parser.flag(...keys);
	}

	public getOption(...keys: readonly string[]) {
		return this.parser.option(...keys);
	}

	public getOptions(...keys: readonly string[]) {
		return this.parser.options(...keys);
	}

	public save() {
		this.states.push(this.parser.save());
	}

	public restore() {
		if (this.states.length !== 0) this.parser.restore(this.states.pop()!);
	}

	private resolveArgument<T>(arg: keyof ArgumentType | IArgument<T>): IArgument<T> | undefined {
		if (typeof arg === 'object') return arg;
		return this.command.argumentManager.findArgument(arg as string) as IArgument<T> | undefined;
	}

	public static make<T>(cb: IArgument<T>['run'], name = ''): IArgument<T> {
		return { run: cb, name };
	}

	public static error<T>(argument: IArgument<T>, parameter: string, message: string): ArgumentError<T>;
	// eslint-disable-next-line @typescript-eslint/unified-signatures
	public static error<T>(argument: IArgument<T>, parameter: string, type: string, message: string): ArgumentError<T>;
	public static error<T>(argument: IArgument<T>, parameter: string, typeOrMessage: string, rawMessage?: string): ArgumentError<T> {
		const [type, message] = typeof rawMessage === 'undefined' ? [argument.name, typeOrMessage] : [typeOrMessage, rawMessage];
		return new ArgumentError<T>(argument, parameter, type, message);
	}

}

export interface ArgOptions extends Omit<ArgumentContext, 'message' | 'command'> {}

export interface RepeatArgOptions extends ArgOptions {
	times?: number;
}
