/**
 * It contains children and information does
 * every lot instance have
 */
export interface LotModel extends Model {}

/**
 * Attributes for each lot as a model object.
 */
export interface LotAttributes {
  /**
   * Each lot has a unique id assigned upon spawning
   * a new Lot component.
   *
   * It is useful for verification and identification to
   * do something from client to server.
   */
  Id: string;

  /**
   * Each lot has an owner to know if this lot is
   * occupied and use for verification.
   */
  Owner?: number;
}
