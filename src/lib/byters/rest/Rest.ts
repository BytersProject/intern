import { Component, ComponentAPI, PluginReference } from '@ayanaware/bento';
import { RedisMutex, Rest as SpecRest } from '@spectacles/rest';
import Redis from 'ioredis';
import { Byters } from '../Byters';

export class Rest implements Component {

	public name = 'Rest';
	public api!: ComponentAPI;
	public parent: PluginReference = Byters;

	public redisClient = new Redis();
	// todo: get token and redis client from intern/bento
	public restHandler = new SpecRest('token', {
		mutex: new RedisMutex(this.redisClient, 'rest')
	});

}
