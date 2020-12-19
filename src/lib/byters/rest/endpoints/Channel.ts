import { Component, ComponentAPI, Inject, PluginReference } from '@ayanaware/bento';
import {
	RESTDeleteAPIChannelAllMessageReactionsResult,
	RESTDeleteAPIChannelMessageReactionResult,
	RESTDeleteAPIChannelMessageResult,
	RESTDeleteAPIChannelPermissionsResult,
	RESTDeleteAPIChannelPinResult,
	RESTDeleteAPIChannelResult,
	RESTGetAPIChannelInvitesResult,
	RESTGetAPIChannelMessageReactionsResult,
	RESTGetAPIChannelMessageResult,
	RESTGetAPIChannelPinsResult,
	RESTGetAPIChannelResult,
	RESTGetAPIInviteResult,
	RESTPatchAPIChannelJSONBody,
	RESTPatchAPIChannelMessageJSONBody,
	RESTPatchAPIChannelMessageResult,
	RESTPatchAPIChannelResult,
	RESTPostAPIChannelInviteJSONBody,
	RESTPostAPIChannelMessageCrosspostResult,
	RESTPostAPIChannelMessageJSONBody,
	RESTPostAPIChannelMessageResult,
	RESTPostAPIChannelMessagesBulkDeleteJSONBody,
	RESTPostAPIChannelMessagesBulkDeleteResult,
	RESTPostAPIChannelTypingResult,
	RESTPutAPIChannelMessageReactionResult,
	RESTPutAPIChannelPermissionsJSONBody,
	RESTPutAPIChannelPermissionsResult,
	RESTPutAPIChannelPinResult, Routes
} from 'discord-api-types';
import { Rest } from '../Rest';

export class Guild implements Component {

	public name = 'RestChannel';
	public api!: ComponentAPI;
	public parent: PluginReference = Rest;

	@Inject() private rest!: Rest;

	public get(channelID: string) {
		return this.rest.handler.get(Routes.channel(channelID)) as Promise<RESTGetAPIChannelResult>;
	}

	public update(channelID: string, data: RESTPatchAPIChannelJSONBody) {
		return this.rest.handler.patch(Routes.channel(channelID), data) as Promise<RESTPatchAPIChannelResult>;
	}

	public delete(channelID: string) {
		return this.rest.handler.delete(Routes.channel(channelID)) as Promise<RESTDeleteAPIChannelResult>;
	}

	public editPermissions(channelID: string, overwriteID: string, data: RESTPutAPIChannelPermissionsJSONBody) {
		return this.rest.handler.put(Routes.channelPermissions(channelID, overwriteID), data) as Promise<RESTPutAPIChannelPermissionsResult>;
	}

	public deletePermissions(channelID: string, overwriteID: string) {
		return this.rest.handler.delete(Routes.channelPermissions(channelID, overwriteID)) as Promise<RESTDeleteAPIChannelPermissionsResult>;
	}

	public getInvites(channelID: string) {
		return this.rest.handler.get(Routes.channelInvite(channelID)) as Promise<RESTGetAPIChannelInvitesResult>;
	}

	public createInvite(channelID: string, data: RESTPostAPIChannelInviteJSONBody) {
		return this.rest.handler.post(Routes.channelInvite(channelID), data) as Promise<RESTGetAPIInviteResult>;
	}

	public triggerTyping(channelID: string) {
		return this.rest.handler.post(Routes.channelTyping(channelID), {}) as Promise<RESTPostAPIChannelTypingResult>;
	}

	public getPins(channelID: string) {
		return this.rest.handler.get(Routes.channelPins(channelID)) as Promise<RESTGetAPIChannelPinsResult>;
	}

	public pinMessage(channelID: string, messageID: string) {
		return this.rest.handler.put(Routes.channelPin(channelID, messageID), {}) as Promise<RESTPutAPIChannelPinResult>;
	}

	public removePinnedMessage(channelID: string, messageID: string) {
		return this.rest.handler.delete(Routes.channelPin(channelID, messageID), {}) as Promise<RESTDeleteAPIChannelPinResult>;
	}

	/* todo: can't figure out how to do queries
	public getMessages(channelID: string, query: RESTGetAPIChannelMessagesQuery) {
		return this.rest.handler.get(Routes.channelMessages(channelID), {
			body: {
				limit: query.limit || 100,
				before: query.before,
				after: query.after,
				around: query.around
			}
		}) as Promise<RESTGetAPIChannelMessagesResult>;
	}
	*/

	public getMessage(channelID: string, messageID: string) {
		return this.rest.handler.get(Routes.channelMessage(channelID, messageID)) as Promise<RESTGetAPIChannelMessageResult>;
	}

	public sendMessage(channelID: string, data: RESTPostAPIChannelMessageJSONBody) {
		return this.rest.handler.post(Routes.channelMessages(channelID), data) as Promise<RESTPostAPIChannelMessageResult>;
	}

	public crosspost(channelID: string, messageID: string) {
		return this.rest.handler.post(Routes.channelCrosspost(channelID, messageID), {}) as Promise<RESTPostAPIChannelMessageCrosspostResult>;
	}

	public createOwnReaction(channelID: string, messageID: string, emojiID: string) {
		return this.rest.handler.put(Routes.channelMessageOwnReaction(channelID, messageID, emojiID), {}) as Promise<RESTPutAPIChannelMessageReactionResult>;
	}

	public deleteOwnReaction(channelID: string, messageID: string, emojiID: string) {
		return this.rest.handler.delete(Routes.channelMessageOwnReaction(channelID, messageID, emojiID), {}) as Promise<RESTDeleteAPIChannelMessageReactionResult>;
	}

	public deleteUserReaction(channelID: string, messageID: string, emojiID: string, userID: string) {
		return this.rest.handler.delete(Routes.channelMessageUserReaction(channelID, messageID, emojiID, userID), {}) as Promise<RESTDeleteAPIChannelMessageReactionResult>;
	}

	public getReaction(channelID: string, messageID: string, emojiID: string) {
		return this.rest.handler.get(Routes.channelMessageSpecificReaction(channelID, messageID, emojiID)) as Promise<RESTGetAPIChannelMessageReactionsResult>;
	}

	public deleteReaction(channelID: string, messageID: string, emojiID: string) {
		return this.rest.handler.delete(Routes.channelMessageSpecificReaction(channelID, messageID, emojiID)) as Promise<RESTDeleteAPIChannelMessageReactionResult>;
	}

	public deleteReactions(channelID: string, messageID: string) {
		return this.rest.handler.delete(Routes.channelMessageAllReactions(channelID, messageID)) as Promise<RESTDeleteAPIChannelAllMessageReactionsResult>;
	}

	public editMessage(channelID: string, messageID: string, data: RESTPatchAPIChannelMessageJSONBody) {
		return this.rest.handler.patch(Routes.channelMessage(channelID, messageID), data) as Promise<RESTPatchAPIChannelMessageResult>;
	}

	public deleteMessage(channelID: string, messageID: string) {
		return this.rest.handler.delete(Routes.channelMessage(channelID, messageID)) as Promise<RESTDeleteAPIChannelMessageResult>;
	}

	public bulkDeleteMessages(channelID: string, data: RESTPostAPIChannelMessagesBulkDeleteJSONBody) {
		return this.rest.handler.post(Routes.channelBulkDelete(channelID), data) as Promise<RESTPostAPIChannelMessagesBulkDeleteResult>;
	}

}
