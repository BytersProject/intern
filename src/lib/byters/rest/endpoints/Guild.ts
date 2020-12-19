import { Component, ComponentAPI, Inject, PluginReference } from '@ayanaware/bento';
import {
	RESTDeleteAPIGuildBanResult,
	RESTDeleteAPIGuildEmojiResult,
	RESTDeleteAPIGuildMemberResult,
	RESTDeleteAPIGuildMemberRoleResult,
	RESTDeleteAPIGuildResult,
	RESTDeleteAPIGuildRoleResult,
	RESTGetAPIGuildBanResult,
	RESTGetAPIGuildBansResult,
	RESTGetAPIGuildChannelsResult,
	RESTGetAPIGuildEmojiResult,
	RESTGetAPIGuildEmojisResult,
	RESTGetAPIGuildInvitesResult,
	RESTGetAPIGuildResult,
	RESTGetAPIGuildRolesResult,
	RESTGetAPIGuildVanityUrlResult,
	RESTGetAPIGuildVoiceRegionsResult,
	RESTGetAPIGuildWidgetImageResult,
	RESTGetAPIGuildWidgetResult,
	RESTPatchAPIGuildChannelPositionsJSONBody,
	RESTPatchAPIGuildChannelPositionsResult,
	RESTPatchAPIGuildEmojiJSONBody,
	RESTPatchAPIGuildEmojiResult,
	RESTPatchAPIGuildJSONBody,
	RESTPatchAPIGuildMemberJSONBody,
	RESTPatchAPIGuildRoleJSONBody,
	RESTPatchAPIGuildRolePositionsJSONBody,
	RESTPatchAPIGuildRolePositionsResult,
	RESTPatchAPIGuildRoleResult,
	RESTPatchAPIGuildWidgetSettingsJSONBody,
	RESTPatchAPIGuildWidgetSettingsResult,
	RESTPostAPIGuildChannelJSONBody,
	RESTPostAPIGuildChannelResult,
	RESTPostAPIGuildEmojiJSONBody,
	RESTPostAPIGuildEmojiResult,
	RESTPostAPIGuildRoleJSONBody,
	RESTPostAPIGuildRoleResult,
	RESTPutAPIGuildBanJSONBody,
	RESTPutAPIGuildBanResult,
	RESTPutAPIGuildMemberRoleResult,
	Routes
} from 'discord-api-types';
import { Rest } from '../Rest';

export class Guild implements Component {

	public name = 'RestGuild';
	public api!: ComponentAPI;
	public parent: PluginReference = Rest;

	@Inject() private rest!: Rest;

	// CORE GUILD
	public get(guildID: string) {
		return this.rest.handler.get(Routes.guild(guildID)) as Promise<RESTGetAPIGuildResult>;
	}

	public update(guildID: string, update: RESTPatchAPIGuildJSONBody) {
		return this.rest.handler.patch(Routes.guild(guildID), update) as Promise<RESTGetAPIGuildResult>;
	}

	public leave(guildID: string) {
		return this.rest.handler.delete(Routes.guild(guildID)) as Promise<RESTDeleteAPIGuildResult>;
	}

	public getBans(guildID: string) {
		return this.rest.handler.get(Routes.guildBans(guildID)) as Promise<RESTGetAPIGuildBansResult>;
	}

	public voiceRegion(guildID: string) {
		return this.rest.handler.get(Routes.guildVoiceRegions(guildID)) as Promise<RESTGetAPIGuildVoiceRegionsResult>;
	}

	public voiceRegions() {
		return this.rest.handler.get(Routes.voiceRegions()) as Promise<RESTGetAPIGuildVoiceRegionsResult>;
	}

	public getInvites(guildID: string) {
		return this.rest.handler.get(Routes.guildInvites(guildID)) as Promise<RESTGetAPIGuildInvitesResult>;
	}

	public vanity(guildID: string) {
		return this.rest.handler.get(Routes.guildVanityUrl(guildID)) as Promise<RESTGetAPIGuildVanityUrlResult>;
	}

	public getWidget(guildID: string) {
		return this.rest.handler.get(Routes.guildWidget(guildID)) as Promise<RESTGetAPIGuildWidgetResult>;
	}

	public updateWidget(guildID: string, data: RESTPatchAPIGuildWidgetSettingsJSONBody) {
		return this.rest.handler.patch(Routes.guildWidgetSettings(guildID), data) as Promise<RESTPatchAPIGuildWidgetSettingsResult>;
	}

	public getWidgetImage(guildID: string) {
		return this.rest.handler.get(Routes.guildWidgetImage(guildID)) as Promise<RESTGetAPIGuildWidgetImageResult>;
	}

	// CHANNELS
	public getChannels(guildID: string) {
		return this.rest.handler.get(Routes.guildChannels(guildID)) as Promise<RESTGetAPIGuildChannelsResult>;
	}

	public createChannel(guildID: string, data: RESTPostAPIGuildChannelJSONBody) {
		return this.rest.handler.post(Routes.guildChannels(guildID), data) as Promise<RESTPostAPIGuildChannelResult>;
	}

	public moveChannels(guildID: string, data: RESTPatchAPIGuildChannelPositionsJSONBody) {
		return this.rest.handler.patch(Routes.guildChannels(guildID), data) as Promise<RESTPatchAPIGuildChannelPositionsResult>;
	}

	// MEMBERS
	/* todo: can't figure out how to do queries
	public getMembers(guildID: string, query: RESTGetAPIGuildMembersQuery) {
		let queryString = '';
		if (query.limit) queryString += `?limit=${query.limit}`;
		if (query.after) queryString += `&after=${query.after}`;

		return this.rest.handler.get(Routes.guildMembers(guildID) + queryString) as Promise<RESTGetAPIGuildMemberResult>;
	}

	public getMember(guildID: string, memberID: string) {
		return this.rest.handler.get(Routes.guildMember(guildID, memberID)) as Promise<RESTGetAPIGuildMemberResult>;
	}
	*/

	public kickMember(guildId: string, memberID: string, reason?: string) {
		return this.rest.handler.delete(Routes.guildMember(guildId, memberID), {
			reason
		}) as Promise<RESTDeleteAPIGuildMemberResult>;
	}

	public updateMember(guildID: string, memberID: string, data: RESTPatchAPIGuildMemberJSONBody) {
		return this.rest.handler.patch(Routes.guildMember(guildID, memberID), data) as Promise<RESTPatchAPIGuildMemberJSONBody>;
	}

	public getBan(guildID: string, memberID: string) {
		return this.rest.handler.get(Routes.guildBan(guildID, memberID)) as Promise<RESTGetAPIGuildBanResult>;
	}

	public ban(guildID: string, memberID: string, data: RESTPutAPIGuildBanJSONBody) {
		return this.rest.handler.put(Routes.guildBan(guildID, memberID), data) as Promise<RESTPutAPIGuildBanResult>;
	}

	public unban(guildID: string, memberID: string) {
		return this.rest.handler.delete(Routes.guildBan(guildID, memberID)) as Promise<RESTDeleteAPIGuildBanResult>;
	}

	// ROLES
	public getRoles(guildID: string) {
		return this.rest.handler.get(Routes.guildRoles(guildID)) as Promise<RESTGetAPIGuildRolesResult>;
	}

	public createRole(guildID: string, data: RESTPostAPIGuildRoleJSONBody) {
		return this.rest.handler.post(Routes.guildRoles(guildID), data) as Promise<RESTPostAPIGuildRoleResult>;
	}

	public moveRole(guildID: string, data: RESTPatchAPIGuildRolePositionsJSONBody) {
		return this.rest.handler.patch(Routes.guildRoles(guildID), data) as Promise<RESTPatchAPIGuildRolePositionsResult>;
	}

	public updateRole(guildID: string, roleID: string, data: RESTPatchAPIGuildRoleJSONBody) {
		return this.rest.handler.patch(Routes.guildRole(guildID, roleID), data) as Promise<RESTPatchAPIGuildRoleResult>;
	}

	public deleteRole(guildID: string, roleID: string) {
		return this.rest.handler.delete(Routes.guildRole(guildID, roleID)) as Promise<RESTDeleteAPIGuildRoleResult>;
	}

	public addMemberRole(guildID: string, memberID: string, roleID: string, reason: string) {
		return this.rest.handler.put(Routes.guildMemberRole(guildID, memberID, roleID), {
			reason
		}) as Promise<RESTPutAPIGuildMemberRoleResult>;
	}

	public removeMemberRole(guildID: string, memberID: string, roleID: string, reason: string) {
		return this.rest.handler.delete(Routes.guildMemberRole(guildID, memberID, roleID), {
			reason
		}) as Promise<RESTDeleteAPIGuildMemberRoleResult>;
	}

	// EMOJIS
	public createEmoji(guildId: string, data: RESTPostAPIGuildEmojiJSONBody) {
		return this.rest.handler.post(Routes.guildEmojis(guildId), data) as Promise<RESTPostAPIGuildEmojiResult>;
	}

	public getEmoji(guildId: string, emojiID: string) {
		return this.rest.handler.get(Routes.guildEmoji(guildId, emojiID)) as Promise<RESTGetAPIGuildEmojiResult>;
	}

	public updateEmoji(guildId: string, emojiID: string, data: RESTPatchAPIGuildEmojiJSONBody) {
		return this.rest.handler.patch(Routes.guildEmoji(guildId, emojiID), data) as Promise<RESTPatchAPIGuildEmojiResult>;
	}

	public deleteEmoji(guildId: string, emojiID: string) {
		return this.rest.handler.delete(Routes.guildEmoji(guildId, emojiID)) as Promise<RESTDeleteAPIGuildEmojiResult>;
	}

	public getEmojis(guildId: string) {
		return this.rest.handler.get(Routes.guildEmojis(guildId)) as Promise<RESTGetAPIGuildEmojisResult>;
	}

}

export default Guild;
