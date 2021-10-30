import Spring from "shared/classes/spring";

/**
 * Utilties for Quenty's spring
 * @author Quenty
 */
interface SpringUtils {
	/**
	 * Returns a boolean and the spring's value if the spring
	 * is still animating
	 * @param spring Spring to check for
	 * @param epsilon [opt=1e-6] epsilon value to avoid dividing by 0 and can be overriden
	 * @returns Returns boolean, with if spring is animating, return the position otherwise the Spring's target.
	 */
	animating: <T extends Spring.ScalarValues>(spring: Spring<T>, epsilon?: number) => LuaTuple<[boolean, T]>;

	/**
	 * Add to spring position to adjust for velocity of target. May have to set clock to time().
	 * @param velocty velocity
	 * @param dampen damping value
	 * @param speed given speed value
	 */
	getVelocityAdjustment<T extends Spring.ScalarValues>(velocity: T, dampen: number, speed: number): T;
}

declare const SpringUtils: SpringUtils;
export = SpringUtils;
