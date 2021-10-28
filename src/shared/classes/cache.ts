const EXPIRY_INTERVAL = 5;

export default class Cache<T extends object> {
	private lastUpdateTick = os.clock();
	private isBusy = false;
	private value!: T;

	public constructor(private updateCallback: () => T | Promise<T>) {
		this.updateValue();
	}

	/**
	 * Returns a boolean, if it is the value is now expired
	 * @returns If the cache value is now expired
	 */
	public canUpdate() {
		return os.clock() >= this.lastUpdateTick + EXPIRY_INTERVAL && !this.isBusy;
	}

	/** Updates the cache value */
	public async updateValue(): Promise<void> {
		// busy task
		this.isBusy = true;
		const callback_value = this.updateCallback();

		// promise or regular value?
		if (Promise.is(callback_value)) {
			return callback_value
				.then(value => {
					this.value = value;
				})
				.catch(reason => warn(`[Cache class]: Failed to update value: ${reason}`))
				.finally(() => {
					this.isBusy = false;
					this.lastUpdateTick = os.clock();
				});
		} else {
			this.lastUpdateTick = os.clock();
			this.value = callback_value;
			this.isBusy = false;
		}
	}

	/**
	 * Change the value forcefully
	 *
	 * It ignores the busy activity and time caching
	 */
	public setValueForce(value: T) {
		this.lastUpdateTick = os.clock();
		this.value = value;
	}

	/**
	 * Gets the value of the last saved cache value
	 *
	 * **Be careful**:
	 * This will throw out an error if the update callback
	 * fails to execute via Promise or callback
	 *
	 * To save this problem, you can set `.setValueForce` method.
	 */
	public getValue() {
		// update value if possible
		if (this.canUpdate()) {
			this.updateValue();
		}

		// making sure that value is not nil
		assert(this.value !== undefined, "That value is not loaded due to update callback is still fetching.");
		return this.value;
	}
}
