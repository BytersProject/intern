import { Component, ComponentAPI, Inject, PluginReference } from '@ayanaware/bento';
import {
	RESTDeleteAPIWebhookResult,
	RESTDeleteAPIWebhookWithTokenMessageResult,
	RESTDeleteAPIWebhookWithTokenResult,
	RESTGetAPIChannelWebhooksResult,
	RESTGetAPIGuildWebhooksResult,
	RESTGetAPIWebhookResult,
	RESTPatchAPIWebhookJSONBody,
	RESTPatchAPIWebhookResult,
	RESTPatchAPIWebhookWithTokenJSONBody,
	RESTPatchAPIWebhookWithTokenMessageJSONBody,
	RESTPatchAPIWebhookWithTokenResult,
	RESTPostAPIChannelWebhookJSONBody,
	RESTPostAPIChannelWebhookResult,
	RESTPostAPIWebhookWithTokenFormDataBody,
	RESTPostAPIWebhookWithTokenGitHubQuery,
	RESTPostAPIWebhookWithTokenJSONBody,
	RESTPostAPIWebhookWithTokenResult,
	RESTPostAPIWebhookWithTokenSlackQuery,
	Routes
} from 'discord-api-types';
import { Rest } from '../Rest';

export class User implements Component {

	public name = 'RestWebhook';
	public api!: ComponentAPI;
	public parent: PluginReference = Rest;

	@Inject() private rest!: Rest;

	public createInChannel(channelID: string, data: RESTPostAPIChannelWebhookJSONBody) {
		return this.rest.handler.post(Routes.channelWebhooks(channelID), { data }) as Promise<RESTPostAPIChannelWebhookResult>;
	}

	public get(webhookID: string) {
		return this.rest.handler.get(Routes.webhook(webhookID)) as Promise<RESTGetAPIWebhookResult>;
	}

	public getWithToken(webhookID: string, token: string) {
		return this.rest.handler.get(Routes.webhook(webhookID, token)) as Promise<RESTGetAPIWebhookResult>;
	}

	public getAllChannel(channelID: string) {
		return this.rest.handler.get(Routes.channelWebhooks(channelID)) as Promise<RESTGetAPIChannelWebhooksResult>;
	}

	public getAllGuild(guildID: string) {
		return this.rest.handler.get(Routes.guildWebhooks(guildID)) as Promise<RESTGetAPIGuildWebhooksResult>;
	}

	public modifyWebhook(webhookID: string, data: RESTPatchAPIWebhookJSONBody) {
		return this.rest.handler.patch(Routes.webhook(webhookID), { data }) as Promise<RESTPatchAPIWebhookResult>;
	}

	public modifyWebhookWithToken(webhookID: string, token: string, data: RESTPatchAPIWebhookWithTokenJSONBody) {
		return this.rest.handler.patch(Routes.webhook(webhookID, token), { data }) as Promise<RESTPatchAPIWebhookWithTokenResult>;
	}

	public delete(webhookID: string) {
		return this.rest.handler.delete(Routes.webhook(webhookID)) as Promise<RESTDeleteAPIWebhookResult>;
	}

	public deleteWithToken(webhookID: string, token: string) {
		return this.rest.handler.delete(Routes.webhook(webhookID, token)) as Promise<RESTDeleteAPIWebhookWithTokenResult>;
	}

	public executeWebhook(webhookID: string, token: string, data: RESTPostAPIWebhookWithTokenJSONBody) {
		return this.rest.handler.patch(Routes.webhook(webhookID, token), { data }) as Promise<RESTPostAPIWebhookWithTokenResult>;
	}

	public executeSlackWebhook(webhookID: string, token: string, data: RESTPostAPIWebhookWithTokenSlackQuery) {
		return this.rest.handler.patch(Routes.webhook(webhookID, token), { data }) as Promise<RESTPostAPIWebhookWithTokenResult>;
	}

	public executeGithubWebhook(webhookID: string, token: string, data: RESTPostAPIWebhookWithTokenGitHubQuery) {
		return this.rest.handler.patch(Routes.webhook(webhookID, token), { data }) as Promise<RESTPostAPIWebhookWithTokenResult>;
	}

	public executeFormWebhook(webhookID: string, token: string, data: RESTPostAPIWebhookWithTokenFormDataBody) {
		return this.rest.handler.patch(Routes.webhook(webhookID, token), { data }) as Promise<RESTPostAPIWebhookWithTokenResult>;
	}

	public editMessageWithToken(webhookID: string, token: string, messageID: string, data: RESTPatchAPIWebhookWithTokenMessageJSONBody) {
		return this.rest.handler.patch(Routes.webhookMessage(webhookID, token, messageID), { data }) as Promise<never>;
	}

	public deleteMessageWithToken(webhookID: string, token: string, messageID: string) {
		return this.rest.handler.delete(Routes.webhookMessage(webhookID, token, messageID)) as Promise<RESTDeleteAPIWebhookWithTokenMessageResult>;
	}

}
