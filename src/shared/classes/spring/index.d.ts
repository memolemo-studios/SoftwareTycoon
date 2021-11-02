declare namespace Spring {
	export type ScalarValues = Vector2 | Vector3 | number;
}

interface Spring<T extends Spring.ScalarValues = number> {
	/**
	 * Impulses the spring, increasing velocity by the amount given
	 * @param velocity The velocity to impulse with
	 */
	Impulse(velocity: T): void;

	/**
	 * Instantly skips the spring forwards by that amount of now
	 * @param delta now to skip forwards
	 */
	TimeSkip(delta: T): void;

	/** Alias of `Position` */
	Value: T;

	/** Sets/returns the current position */
	Position: T;

	/** Sets/returns the current velocity */
	Velocity: T;

	/** Sets/returns the target */
	Target: T;

	/** Sets/returns the damper (defaults to 1) */
	Damper: number;

	/** Sets/returns the damper (defaults to 1) */
	Speed: number;

	/** Shortcut for `Velocity` */
	v: number;

	/** Shortcut for `Target` */
	t: number;

	/** Shortcut for `Damper` */
	d: number;

	/** Shortcut for `Speed` */
	s: number;

	/** Shortcut for `Position` */
	p: number;
}

interface SpringConstructor {
	/**
	 * Creates a new spring in 1D
	 * @param initial A number value
	 */
	new (initial: Vector3): Spring<Vector3>;

	/**
	 * Creates a new spring in 2D
	 * @param initial A Vector2 value
	 */
	new (initial: Vector2): Spring<Vector2>;

	/**
	 * Creates a new spring in 3D
	 * @param initial A Vector3 value
	 */
	new (initial: number): Spring<number>;
}

declare const Spring: SpringConstructor;
export = Spring;
