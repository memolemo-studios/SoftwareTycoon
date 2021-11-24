export namespace MathUtil {
  /** TODO: Add documentation */
  export function lerp(start: number, stop: number, alpha: number) {
    return start + (stop - start) * alpha;
  }
}
