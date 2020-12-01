/* eslint-disable no-redeclare,@typescript-eslint/naming-convention */

/*
	This file has been adopted from sapphire-project/framework (https://github.com/sapphire-project/framework/blob/08092b196f63fd4eb7233c8763fe7aad1b301c1c/src/lib/utils/Result.ts)
	Copyright © 2018-2020 The Sapphire Project and its contributors
*/

/**
 * A type used to express computations that can fail.
 * @typeparam T The result's type.
 * @typeparam E The error's type.
 * @since 1.0.0
 */
export type Result<T, E> = Ok<T> | Err<E>;

/**
 * The computation is successful.
 * @typeparam T Type of results.
 * @since 1.0.0
 */
export interface Ok<T> {
	/**
	 * Whether or not the result was successful, always true in Ok<T>.
	 * @since 1.0.0
	 */
	readonly success: true;

	/**
	 * The resulting value, defined only in Ok<T>.
	 * @since 1.0.0
	 */
	readonly value: T;
}

/**
 * The computation failed.
 * @typeparam E Type of errors.
 * @since 1.0.0
 */
export interface Err<E> {
	/**
	 * Whether or not the result was successful, always false in Err<E>.
	 * @since 1.0.0
	 */
	readonly success: false;

	/**
	 * The resulting error, defined only in Err<E>.
	 * @since 1.0.0
	 */
	readonly error: E;
}

/**
 * Creates an Ok with no value.
 * @return A successful Result.
 * @since 1.0.0
 */
export function ok(): Ok<unknown>;
/**
 * Creates an Ok.
 * @typeparam T The result's type.
 * @param x Value to use.
 * @return A successful Result.
 * @since 1.0.0
 */
export function ok<T>(x: T): Ok<T>;
export function ok<T>(x?: T): Ok<unknown> {
	return { success: true, value: x };
}

/**
 * Creates an Err with no error.
 * @return An erroneous Result.
 * @since 1.0.0
 */
export function err(): Err<unknown>;
/**
 * Creates an Err.
 * @typeparam E The error's type.
 * @param x Value to use.
 * @return An erroneous Result.
 * @since 1.0.0
 */
export function err<E>(x: E): Err<E>;
export function err<E>(x?: E): Err<unknown> {
	return { success: false, error: x };
}

/**
 * Determines whether or not a result is an Ok.
 * @typeparam T The result's type.
 * @typeparam E The error's type.
 * @since 1.0.0
 */
export function isOk<T, E>(x: Result<T, E>): x is Ok<T> {
	return x.success;
}

/**
 * Determines whether or not a result is an Err.
 * @typeparam T The result's type.
 * @typeparam E The error's type.
 * @since 1.0.0
 */
export function isErr<T, E>(x: Result<T, E>): x is Err<E> {
	return !x.success;
}
