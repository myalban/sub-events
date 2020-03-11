import {ISubOptions, ISubStat, SubEvent, SubFunction} from './event';
import {Subscription} from './sub';

/**
 * This is for private property implementation.
 *
 * @hidden
 */
const eventsMap: WeakMap<object, SubEvent<any>> = new WeakMap();

/**
 * @hidden
 */
const consume = <T>(obj: EventConsumer) => eventsMap.get(obj) as SubEvent<T>;

/**
 * #### class EventConsumer\<T = unknown, E extends SubEvent\<T\> = SubEvent\<T\>>
 *
 * Encapsulates an event object, in order to hide its methods [[emit]] and [[cancelAll]], so the event
 * consumer can only receive the event, but cannot emit it, or cancel other subscriptions.
 *
 * It is a non-extendable class, with the same signature as [[SubEvent]], minus methods [[emit]] and [[cancelAll]].
 *
 * ```ts
 * // Example of using EventConsumer inside a component.
 *
 * import {SubEvent, EventConsumer} from 'sub-events';
 *
 * class MyComponent {
 *
 *     private event: SubEvent<string> = new SubEvent(); // internal, send-receive event
 *
 *     readonly safeEvent: EventConsumer<string>; // public, receive-only event container
 *
 *     constructor() {
 *        this.safeEvent = new EventConsumer(this.event);
 *
 *        // clients can only receive data from such "safeEvent",
 *        // they cannot emit data or cancel other subscriptions.
 *     }
 * }
 * ```
 *
 */
export class EventConsumer<T = unknown, E extends SubEvent<T> = SubEvent<T>> {

    /**
     * Class Constructor.
     *
     * @param event
     * Event object to be encapsulated.
     */
    constructor(event: E) {
        eventsMap.set(this, event);
    }

    /**
     * Forwards into [[SubEvent.count]] of the contained event.
     */
    get count(): number {
        return consume<T>(this).count;
    }

    /**
     * Forwards into [[SubEvent.maxSubs]] of the contained event.
     */
    get maxSubs(): number {
        return consume<T>(this).maxSubs;
    }

    /**
     * Forwards into [[SubEvent.subscribe]] of the contained event.
     */
    subscribe(cb: SubFunction<T>, options?: ISubOptions): Subscription {
        return consume<T>(this).subscribe(cb, options);
    }

    /**
     * Forwards into [[SubEvent.once]] of the contained event.
     */
    once(cb: SubFunction<T>, options?: ISubOptions): Subscription {
        return consume<T>(this).once(cb, options);
    }

    /**
     * Forwards into [[SubEvent.toPromise]] of the contained event.
     */
    toPromise(options?: { name?: string, timeout?: number }): Promise<T> {
        return consume<T>(this).toPromise(options);
    }

    /**
     * Forwards into [[SubEvent.getStat]] of the contained event.
     */
    getStat(options?: { minUse?: number }): ISubStat {
        return consume<T>(this).getStat(options);
    }

}
