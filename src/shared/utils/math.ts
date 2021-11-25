export namespace MathUtil {
  /** Lerps from start to the end with the alpha parameter */
  export function lerp(start: number, stop: number, alpha: number) {
    return start + (stop - start) * alpha;
  }
}
