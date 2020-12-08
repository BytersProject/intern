import { Component, ComponentAPI, Inject, PluginReference } from '@ayanaware/bento';
import type { Broker } from '@byters/brokers.js';
import { RedisMutex, Rest as SpecRest } from '@spectacles/rest';
import Redis from 'ioredis';
import * as path from 'path';
import type { Intern } from '../../Intern';
import { Byters } from '../Byters';
import type { Guild } from './Guild';

export class Rest implements Component {

	public name = 'Rest';
	public api!: ComponentAPI;
	public parent: PluginReference = Byters;

	/**
	 * @deprecated
	 */
	public redisClient = new Redis();
	// todo: get token and redis client from intern/bento
	public handler = new SpecRest('token', {
		mutex: new RedisMutex(this.redisClient, 'rest')
	});

	@Inject() private intern!: Intern<Broker<any, any>>;

	public async onLoad() {
		const guild: Guild = await (this.intern.fsLoader as any).createInstance(path.resolve(__dirname, 'Guild'));
		await this.intern.api.bento.addComponent(guild);
	}

}
