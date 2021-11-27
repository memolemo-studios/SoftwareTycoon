import { SingleMotor } from "@rbxts/flipper";
import Roact, { Binding, BindingFunction } from "@rbxts/roact";
import { RoactUtil } from "shared/utils/roact";

/**
 * A roact class that handles binding
 * without requiring setter and the getter of each
 * Roact binding and minimize the clutter of class members
 */
export class BindingBundle<T> {
  protected binding!: Binding<T>;
  private updateBinding!: BindingFunction<T>;

  /** Creates a new binding bundle */
  public constructor(initialValue: T) {
    this.setup(initialValue);
  }

  /** Gets the binding value immediately */
  public getValue() {
    return this.binding.getValue();
  }

  /** Sets up the binding stuff */
  protected setup(initialValue: T) {
    [this.binding, this.updateBinding] = Roact.createBinding(initialValue);
  }

  /** Sets the binding with a simple method */
  public set(value: T) {
    this.updateBinding(value);
  }

  /** Gets the binding */
  public get() {
    return this.binding;
  }
}

/**
 * A roact class has the same actions as BindingBundle
 * but for Flipper motors
 */
export class BindingBundleMotor extends BindingBundle<number> {
  private motor!: SingleMotor;

  public constructor(initialValue?: number) {
    super(initialValue ?? 0);
  }

  protected setup(initialValue: number) {
    this.motor = new SingleMotor(initialValue);
    this.binding = RoactUtil.makeBindingFromMotor(this.motor);
  }

  public getValue() {
    return this.motor.getValue();
  }

  public getMotor() {
    return this.motor;
  }

  /**
   * Set method is not available in BindingBundleMotor.
   *
   * Use `motor.setGoal` instead.
   * @hidden */
  public set() {
    error("Use `bundle.getMotor().setGoal()` instead.", 2);
  }
}
