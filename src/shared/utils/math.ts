export namespace MathUtil {
  /** Lerps from start to the end with the alpha parameter */
  export function lerp(start: number, stop: number, alpha: number) {
    return start + (stop - start) * alpha;
  }

  /** MathUtil.lerp functionality but it applies for all of the alpha values */
  export function blendValues(...values: number[]) {
    return values.reduce((alpha, value) => alpha + (1 - alpha) * value);
  }
}
