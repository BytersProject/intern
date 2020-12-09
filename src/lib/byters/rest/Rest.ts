/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ComponentAPI, Inject, PluginReference, Variable } from '@ayanaware/bento';
import type { Broker } from '@byters/brokers.js';
import { RedisMutex, Rest as SpecRest } from '@spectacles/rest';
import Redis from 'ioredis';
import type { Intern } from '../../Intern';
import { InternVariable } from '../../InternVariable';
import { enumerable } from '../../utils/utils';
import { Byters } from '../Byters';

export class Rest implements Component {

	public name = 'Rest';
	public api!: ComponentAPI;
	public parent: PluginReference = Byters;

	@Variable({ 'name': InternVariable.INTERN_BOT_TOKEN, 'default': '' })
	@enumerable(false)
	private token!: string;

	/**
	 * @deprecated
	 */
	public redisClient = new Redis();
	// todo: get token and redis client from intern/bento
	public handler = new SpecRest(this.token, {
		mutex: new RedisMutex(this.redisClient, 'rest')
	});

	@Inject() private intern!: Intern<Broker<any, any>>;

	public async onLoad() {
		await this.api.loadComponents(this.intern.fsLoader, __dirname, 'endpoints');
	}

}
