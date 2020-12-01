/* eslint-disable @typescript-eslint/naming-convention */

/*
	This file has been adopted from sapphire-project/framework (https://github.com/sapphire-project/framework/blob/12f9e114d404195d3074fe24551d577866e0b2af/src/lib/errors/ArgumentError.ts)
	Copyright © 2018-2020 The Sapphire Project and its contributors
*/

import type { IArgument } from '../arguments';
import { UserError } from './UserError';

export class ArgumentError<T> extends UserError {

	public readonly argument: IArgument<T>;
	public readonly parameter: string;

	public constructor(argument: IArgument<T>, parameter: string, type: string, message: string) {
		super(type, message);
		this.name = 'ArgumentError';
		this.argument = argument;
		this.parameter = parameter;
	}

}
