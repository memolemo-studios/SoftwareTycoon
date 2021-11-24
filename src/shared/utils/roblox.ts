export namespace RobloxUtil {
  /**
   * Joins with default roblox's asset link with the asset id
   * provided in id parameter
   */
  export function assetUrlWithId(id: number) {
    return `rbxassetid://${id}`;
  }
}
