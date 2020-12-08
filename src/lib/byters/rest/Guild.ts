import { Routes } from 'discord-api-types';
import { Component, ComponentAPI, Inject, PluginReference } from '@ayanaware/bento';
import { Rest } from './Rest';

export class Guild implements Component {

	public name = 'RestGuild';
	public api!: ComponentAPI;
	public parent: PluginReference = Rest;

	@Inject() private rest!: Rest;

	public addGuildMemberRole(guildID: string, memberID: string, roleID: string, reason: string) {
		return this.rest.handler.put(Routes.guildMemberRole(guildID, memberID, roleID), {
			reason
		});
	}

}

export default Guild;
