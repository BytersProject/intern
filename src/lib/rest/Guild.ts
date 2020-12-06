import { Routes } from 'discord-api-types';
import { RedisMutex, Rest } from '@spectacles/rest';
import Redis from 'ioredis';

export class Guild {

	public redisClient = new Redis();
	// todo: get token and redis client from intern/bento
	public restHandler = new Rest('token', {
		mutex: new RedisMutex(this.redisClient, 'rest')
	});

	public addGuildMemberRole(guildID: string, memberID: string, roleID: string, reason: string) {
		return this.restHandler.put(Routes.guildMemberRole(guildID, memberID, roleID), {
			reason
		});
	}

}
