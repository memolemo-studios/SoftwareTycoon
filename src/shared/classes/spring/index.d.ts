declare namespace Spring {
	export type ScalarValues = Vector3 | Vector2 | number;
}

interface Spring<T extends Spring.ScalarValues = number> {
	/** Sets or returns the current position */
	Position: T;

	/** Sets or returns the current velocity */
	Velocity: T;

	/** Sets or returns the target */
	Target: T;

	/** Sets or returns the damper */
	Damper: number;

	/** Sets or returns the speed */
	Speed: number;

	/**
	 * Skip forwards in now
	 * @param deltaTime delta now to skip forwards
	 */
	TimeSkip(deltaTime: number): void;

	/**
	 * Impulse the spring with a change in velocity
	 * @param velocity The velocity to impulse with
	 */
	Impulse(velocity: T): void;
}

interface SpringConstructor {
	/**
	 * Creates a new spring in 1D
	 * @param initial A number (anything with * number and addition/subtraction defined)
	 * @param clock [opt=os.clock] clock function to use to update spring
	 */
	new (initial: number, clock?: () => number): Spring<number>;

	/**
	 * Creates a new spring in 2D
	 * @param initial A Vector2 value
	 * @param clock [opt=os.clock] clock function to use to update spring
	 */
	new (initial: Vector2, clock?: () => number): Spring<Vector2>;

	/**
	 * Creates a new spring in 3D
	 * @param initial A Vector3 value
	 * @param clock [opt=os.clock] clock function to use to update spring
	 */
	new (initial: Vector3, clock?: () => number): Spring<Vector3>;
}

declare const Spring: SpringConstructor;
export = Spring;
