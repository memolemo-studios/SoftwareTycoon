export namespace VectorUtil {
  /**
   * Converts all degree vector coordinates into radians coordinates
   * @param vector Vector in degress
   * @returns Vector3 with radian coordinates
   */
  export function toRadians({ X, Y, Z }: Vector3) {
    return new Vector3(math.rad(X), math.rad(Y), math.rad(Z));
  }
}
