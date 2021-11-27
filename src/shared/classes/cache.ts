import Log, { Logger } from "@rbxts/log";
import { GameFlags } from "shared/flags";

/**
 * Cache is a class which it is responsible handling
 * values and updates it manually or automatically if
 * the value expires.
 *
 * It will update the value depending on the return
 * type of the updater function found in constructor.
 */
export class Cache<T = undefined> {
  private currentValue?: T;
  private isUpdating = false;
  private logger: Logger;
  private valueExpires = 0;

  /**
   * Creates a new Cache class
   * @param update Updater function with Promise returned
   */
  public constructor(public name: string, private update: () => Promise<T>) {
    this.logger = Log.ForContext(this);
  }

  /** A method returns if the value needs to be updated */
  public needsUpdate() {
    return (this.currentValue === undefined || os.clock() >= this.valueExpires) && !this.isUpdating;
  }

  /** Tries to get the latest value available in this class */
  public getValue() {
    return this.currentValue;
  }

  /** Forces to set the value instead of the updater function */
  public forceSetValue(value: T) {
    this.valueExpires = os.clock() + GameFlags.CacheExpiryThreshold;
    this.currentValue = value;
  }

  /** __toString method for the Log class */
  public toString() {
    return `Cache<${this.name}>`;
  }

  /** Updates the new value from the updater function */
  public async updateValue() {
    // do not update if it is not expired
    if (!this.needsUpdate()) return this.currentValue as T;
    this.logger.Verbose("Updating value to its newest value", this.toString());
    this.isUpdating = true;

    // update the value and replace with the new value
    return this.update()
      .then(newValue => {
        this.logger.Verbose("Done updating value", this.toString());
        this.valueExpires = os.clock() + GameFlags.CacheExpiryThreshold;
        return (this.currentValue = newValue);
      })
      .catch(reason => {
        this.logger.Error("Failed to update to a new value. Reason: {Reason}", this.toString(), reason);
        return this.currentValue as T;
      })
      .finally<T>(() => {
        this.isUpdating = false;
        return this.currentValue as T;
      });
  }
}
