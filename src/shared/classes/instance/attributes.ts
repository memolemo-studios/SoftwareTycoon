import { Bin } from "@rbxts/bin";
import { deepCopy } from "@rbxts/object-utils";
import Signal from "@rbxts/signal";
import { SupportedAttributeTypes } from "types/roblox";

/**
 * Simple attribute management system
 *
 * I was supposed to use my own attributes package, but it wasn't suited
 * for my needs.
 */
export class Attributes<T extends Record<string, SupportedAttributeTypes | {}>> {
  private attributes = new Map<keyof T, T[keyof T]>();
  private bin = new Bin();
  private connection?: RBXScriptConnection;
  private observantsBin = new Bin();
  private isBusy = false;

  public readonly changed = new Signal<(key: keyof T, value: T[keyof T] | undefined) => void>();

  /** Creates a new attribute management class */
  public constructor(private instance: Instance) {
    // setting it up
    this.bin.add(this.changed);
    this.connection = instance.AttributeChanged.Connect(() => {
      // we don't need to specify what attribute changed
      this.onAttributesChanged();
    });

    this.bin.add(this.observantsBin);
    this.bin.add(() => {
      // making sure it is connected
      if (this.connection !== undefined) {
        this.connection.Disconnect();
        this.connection = undefined;
      }
    });

    // reload attributes
    this.onAttributesChanged();
  }

  /**
   * Sets the current instance of the class
   *
   * **NOTE**: It won't wipe the entire attributes but it will
   * override the attributes from the new instance.
   *
   * If `wiped` parameter is enabled, the last instance will
   * be definitely wiped.
   * @param instance Instance to replace with
   * @param wiped Optional parameter, it allows to wipe the entire attributes of the last instance
   */
  public setInstance(instance: Instance, wiped?: boolean) {
    // making sure that instance isn't the same
    if (instance === this.instance) {
      warn("Attempt to change instance with the same instance object");
      return;
    }

    // copy the entire attributes map
    const copied = deepCopy(this.attributes);

    // destroy the connection, because we don't need it
    this.connection?.Disconnect();
    this.connection = undefined;

    // wipe all of the observants
    this.observantsBin.destroy();

    // wipe the entire attributes if neccessary
    if (wiped) {
      this.wipe();
    }

    // replacing instance
    this.instance = instance;
    this.connection = instance.AttributeChanged.Connect(() => {
      // we don't need to specify what attribute changed
      this.onAttributesChanged();
    });

    // override the attributes table
    this.isBusy = true;
    for (const [key, value] of copied) {
      this.set(key, value as NonNullable<T[keyof T]>);
    }
    this.isBusy = false;
  }

  private onAttributesChanged() {
    // making sure it is not busy (when nuking)
    if (this.isBusy) return;

    // get the entire attributes from instance member
    const attributes = this.instance.GetAttributes() as Map<keyof T, T[keyof T]>;

    // checking for any changes
    for (const [key, value] of attributes) {
      const old_value = this.get(key);
      if (old_value !== value) {
        this.changed.Fire(key, value);
      }
    }

    // replacing the entire attributes table
    this.attributes.clear();
    this.attributes = attributes;
  }

  /**
   * Deletes the attribute
   * @param key Attribute to delete
   */
  public delete<K extends keyof T>(key: K) {
    // to avoid issues with the set method and probably get an update for that
    this.instance.SetAttribute(key as string, undefined);
  }

  /**
   * Observes any changes to the attribute
   * @param key Attribute to observe with
   * @param callback This function will run when an attribute is changed
   */
  public observe<K extends keyof T>(key: K, callback: (new_value: T[K] | undefined) => void) {
    let conn: RBXScriptConnection;
    // eslint-disable-next-line prefer-const
    conn = this.changed.Connect((updated_key, new_value) => {
      if (updated_key === key) {
        callback(new_value as T[K] | undefined);
      }
    });
    this.bin.add(conn);
    return conn;
  }

  /**
   * Sets the attribute to a desired value.
   *
   * **NOTE**: In the value parameter, it must be defined.
   * @param key Attribute to set with the value
   * @param value Non-nullable value to replace with.
   */
  public set<K extends keyof T>(key: K, value: NonNullable<T[K]>) {
    assert(value !== undefined, "Invalid argument #2 (it must be defined)");
    this.instance.SetAttribute(key as string, value);
  }

  /** Copies and gets a local copy of attributes table */
  public getAll(): Map<keyof T, T[keyof T] | undefined> {
    return deepCopy(this.attributes);
  }

  /**
   * Tries to get the attribute
   * @param key Atttribute to get with
   */
  public get<K extends keyof T>(key: K) {
    return this.attributes.get(key);
  }

  /** Wipes the entire attributes table */
  public wipe() {
    this.isBusy = true;

    // nuke it, with a bomb!
    for (const [key] of this.attributes) {
      this.delete(key);
    }

    this.isBusy = false;
  }

  /**
   * Destroys the class
   * @param wipe Optional, it will destroy upon destroying the class
   */
  public destroy(wipe?: boolean) {
    if (wipe === true) {
      this.wipe();
    }
    this.bin.destroy();
  }
}
