/* eslint-disable @typescript-eslint/naming-convention */

/*
	This file has been adopted from sapphire-project/framework (https://github.com/sapphire-project/framework/blob/12f9e114d404195d3074fe24551d577866e0b2af/src/lib/errors/UserError.ts)
	Copyright © 2018-2020 The Sapphire Project and its contributors
*/

export class UserError extends Error {

	public readonly identifier: string;

	public constructor(type: string, message: string) {
		super(message);
		this.name = 'UserError';
		this.identifier = type;
	}

}
