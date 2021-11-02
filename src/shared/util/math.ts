namespace MathUtil {
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
