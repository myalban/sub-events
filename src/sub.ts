/**
 * @class Subscription
 * @description
 * Represents an event subscription, and a safe way to cancel it.
 */
export class Subscription {
    /**
     * @hidden
     */
    private _cancel: null | (() => void);

    /**
     * Subscription name, if one was specified with method [[subscribe]].
     */
    readonly name?: string;

    /**
     * @hidden
     */
    constructor(cancel: () => void, sub: { cancel?: () => void, name?: string }) {
        this._cancel = cancel;
        this.name = sub.name;
        sub.cancel = () => {
            this._cancel = null;
        };
    }

    /**
     * Indicates whether the subscription is live / active.
     *
     * It can be useful to subscribers when [[cancel]] or [[cancelAll]]
     * are used without their knowledge.
     */
    public get live(): boolean {
        return !!this._cancel;
    }

    /**
     * Cancels the live subscription. The subscriber won't receive any more events.
     *
     * It also sets flag [[live]] to `false`.
     *
     * @returns
     * - `true` - subscription has been successfully cancelled
     * - `false` - nothing happened, as subscription wasn't live
     */
    public cancel(): boolean {
        if (this._cancel) {
            this._cancel();
            this._cancel = null;
            return true;
        }
        return false;
    }

}
