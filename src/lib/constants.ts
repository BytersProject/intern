import { Options } from './Intern';
import { AMQpBroker } from '@byters/brokers.js-amqp';
import { CommandOptions } from './commands/interfaces';

export const internOptionDefaults: Options<AMQpBroker> = {
	gateway: {
		broker: {
			instance: new AMQpBroker('gateway', {
				exchange: {
					durable: true
				}
			}),
			startParameters: ['localhost']
		}
	}
};

export const commandOptionDefaults: CommandOptions = {
	aliases: []
};
