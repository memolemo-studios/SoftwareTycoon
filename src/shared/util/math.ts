namespace MathUtil {
	export const TAU = math.pi * 2;

	/**
	 * Floors off any number to a nearest multiple of that number
	 * @param base Base number to floor off with
	 * @param multiple Multiple number
	 */
	export function floorToMultiple(base: number, multiple: number) {
		return math.floor(base / multiple) * multiple;
	}

	/**
	 * Rounds off any number to a nearest multiple of that number
	 * @param base Base number to round off with
	 * @param multiple Multiple number
	 */
	export function roundToMultiple(base: number, multiple: number) {
		return math.round(base / multiple) * multiple;
	}
}

export = MathUtil;
