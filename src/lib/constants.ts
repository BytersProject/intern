import { Options } from './Intern';
import { AMQpBroker } from '@byters/brokers.js-amqp';

export const defaults: Options = {
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
