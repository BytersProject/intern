import { Component, ComponentAPI, Entity } from '@ayanaware/bento';
import { UserError } from '../errors/UserError';
import { Awaited } from '../utils/Types';
import { Args } from './Args';
import { ArgumentManager } from './ArgumentManager';
import { ArgumentContext, ArgumentOptions } from './interfaces';
import { err, ok, Result } from './Result';

export type ArgumentResult<T> = Awaited<Result<T, UserError>>;

export interface IArgument<T> {
	name: string;
	run(argument: string, ctx: ArgumentContext): ArgumentResult<T>;
}

export interface IArgumentComponent<T> extends IArgument<T>, Component { }

export abstract class Argument<T = unknown> implements IArgumentComponent<T> {

	public abstract name: string;

	public api!: ComponentAPI;
	public parent: Entity = ArgumentManager;
	public options?: ArgumentOptions;

	public abstract run(argument: string, ctx: ArgumentContext): ArgumentResult<T>;

	public ok(value: T): ArgumentResult<T> {
		return ok(value);
	}

	public error(parameter: string, message: string): ArgumentResult<T>;
	// eslint-disable-next-line @typescript-eslint/unified-signatures
	public error(parameter: string, type: string, message: string): ArgumentResult<T>;
	public error(parameter: string, typeOrMessage: string, rawMessage?: string): ArgumentResult<T> {
		return err(Args.error<T>(this, parameter, typeOrMessage, rawMessage!));
	}

}
