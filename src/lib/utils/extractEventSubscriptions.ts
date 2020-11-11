import { SharedAPI } from '@ayanaware/bento';
import { EntityEvents, EntityEventSubscription } from '@ayanaware/bento/build/entities/internal/EntityEvents';

// TODO: Definitely refactor this once it becomes "official"
// In the event that you need motivation feel free to listen to https://www.youtube.com/watch?v=SETnK2ny1R0

/**
 * @since 0.0.1
 * @private
 */
export function extractEventSubscriptions(entity: string, api: SharedAPI): Set<string> {
	const usedEvents: Set<string> = new Set();

	const entityEvents = (api as any).bento.entities.events.get(entity) as EntityEvents;
	if (!entityEvents) return usedEvents;

	for (const [, subscription] of ((entityEvents as any).subscriptions as Map<number, EntityEventSubscription>)) {
		usedEvents.add(subscription.name);
	}

	return usedEvents;
}
