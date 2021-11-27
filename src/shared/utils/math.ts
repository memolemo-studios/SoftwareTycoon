export namespace MathUtil {
  /** Lerps from start to the end with the alpha parameter */
  export function lerp(start: number, stop: number, alpha: number) {
    return start + (stop - start) * alpha;
  }

  /** MathUtil.lerp functionality but it applies for all of the alpha values */
  export function blendValues(...values: number[]) {
    return values.reduce((alpha, value) => alpha + (1 - alpha) * value);
  }

  /** Pie divided by twoh */
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
