import { Component, ComponentAPI, Inject, PluginReference } from '@ayanaware/bento';
import {
	RESTDeleteAPICurrentUserGuildResult,
	RESTGetAPIUserResult,
	RESTPatchAPICurrentUserJSONBody,
	RESTPatchAPICurrentUserResult,
	RESTPostAPICurrentUserCreateDMChannelJSONBody,
	RESTPostAPICurrentUserCreateDMChannelResult,
	Routes
} from 'discord-api-types';
import { Rest } from '../Rest';

export class User implements Component {

	public name = 'RestUser';
	public api!: ComponentAPI;
	public parent: PluginReference = Rest;

	@Inject() private rest!: Rest;

	public get(userID: string) {
		return this.rest.handler.get(Routes.user(userID)) as Promise<RESTGetAPIUserResult>;
	}

	public me() {
		return this.get('@me');
	}

	public updateMe(data: RESTPatchAPICurrentUserJSONBody) {
		return this.rest.handler.patch(Routes.user('@me'), data) as Promise<RESTPatchAPICurrentUserResult>;
	}

	public leaveGuild(guildID: string) {
		return this.rest.handler.delete(Routes.userGuild(guildID)) as Promise<RESTDeleteAPICurrentUserGuildResult>;
	}

	public createDM(data: RESTPostAPICurrentUserCreateDMChannelJSONBody) {
		return this.rest.handler.post(Routes.userChannels(), data) as Promise<RESTPostAPICurrentUserCreateDMChannelResult>;
	}

}
