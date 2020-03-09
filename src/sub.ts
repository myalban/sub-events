/**
 * @class Subscription
 * @description
 * Represents an event subscription, and a safe way to cancel it.
 *
 * @see [[cancel]]
 */
export class Subscription {
    /**
     * @hidden
     */
    private _cancel: null | (() => void);

    /**
     * Subscription's `name` option, if it was set with method [[subscribe]].
     */
    readonly name?: string;

    /**
     * @hidden
     */
    constructor(init: { cancel: () => void, sub: { cancel: () => void, name?: string } }) {
        this._cancel = init.cancel;
        this.name = init.sub.name;
        const cc = init.sub.cancel;
        init.sub.cancel = () => {
            this._cancel = null;
            cc();
        };
    }

    /**
     * Indicates whether the subscription is live / active.
     *
     * It can be useful to subscribers when [[cancelAll]] is used without their knowledge.
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
