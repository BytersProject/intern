import { Component, ComponentAPI, Inject, PluginReference } from '@ayanaware/bento';
import {
	RESTGetAPIGuildChannelsResult,
	RESTGetAPIGuildMemberResult,
	RESTGetAPIGuildResult,
	RESTPatchAPIGuildChannelPositionsJSONBody,
	RESTPatchAPIGuildChannelPositionsResult,
	RESTPatchAPIGuildJSONBody,
	RESTPostAPIGuildChannelJSONBody,
	RESTPostAPIGuildChannelResult,
	RESTPutAPIGuildMemberRoleResult,
	Routes
} from 'discord-api-types';
import { Rest } from '../Rest';

export class Guild implements Component {

	public name = 'RestGuild';
	public api!: ComponentAPI;
	public parent: PluginReference = Rest;

	@Inject() private rest!: Rest;

	public get(guildID: string) {
		return this.rest.handler.get(Routes.guild(guildID)) as Promise<RESTGetAPIGuildResult>;
	}

	public modify(guildID: string, update: RESTPatchAPIGuildJSONBody) {
		return this.rest.handler.patch(Routes.guild(guildID), update) as Promise<RESTGetAPIGuildResult>;
	}

	public getChannels(guildID: string) {
		return this.rest.handler.get(Routes.guildChannels(guildID)) as Promise<RESTGetAPIGuildChannelsResult>;
	}

	public createChannel(guildID: string, data: RESTPostAPIGuildChannelJSONBody) {
		return this.rest.handler.post(Routes.guildChannels(guildID), data) as Promise<RESTPostAPIGuildChannelResult>;
	}

	public moveChannels(guildID: string, data: RESTPatchAPIGuildChannelPositionsJSONBody) {
		return this.rest.handler.patch(Routes.guildChannels(guildID), data) as Promise<RESTPatchAPIGuildChannelPositionsResult>;
	}

	public getMember(guildID: string, memberID: string) {
		return this.rest.handler.get(Routes.guildMember(guildID, memberID)) as Promise<RESTGetAPIGuildMemberResult>;
	}

	// Yea idk how to pass a proper body here for the query
	/*
	public getMembers(guildID: string, data: RESTGetAPIGuildMembersQuery) {
		return this.rest.handler.get(Routes.guildMembers(guildID), {  }) as Promise<RESTGetAPIGuildMemberResult>;
	}
	*/

	public addMemberRole(guildID: string, memberID: string, roleID: string, reason: string) {
		return this.rest.handler.put(Routes.guildMemberRole(guildID, memberID, roleID), {
			reason
		}) as Promise<RESTPutAPIGuildMemberRoleResult>;
	}

}

export default Guild;
