import { Client, ClientOptions } from 'eris';
// import { ShardingManager } from './ShardingManager';

export class DiscordClient extends Client {

	public constructor(token: string, options: ClientOptions) {
		super(token, options);
		// todo: this.shards = new ShardingManager();
	}

}
