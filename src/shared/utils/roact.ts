import { GroupMotor, SingleMotor } from "@rbxts/flipper";
import BaseMotor from "@rbxts/flipper/typings/BaseMotor";
import Roact, { createBinding } from "@rbxts/roact";
import StringUtils from "@rbxts/string-utils";

export namespace RoactUtil {
  /** Makes a Roact binding from Flipper's SingleMotor class */
  export function makeBindingFromMotor<T = number>(motor: BaseMotor<T>) {
    const [binding, set_binding] = createBinding((motor as BaseMotor<T> & { getValue(): T }).getValue());
    motor.onStep(set_binding);
    return binding;
  }

  /** Gets a whether if it is a binding value or a real value */
  export function getBindableValue<T>(value: T | Roact.Binding<T>) {
    return RoactUtil.isBinding(value) ? value.getValue() : value;
  }

  /** Returns a boolean if that value is a Roact binding */
  export function isBinding<T>(object: Roact.Binding<T>): object is Roact.Binding<T>;
  export function isBinding(object: unknown): object is Roact.Binding<unknown>;
  export function isBinding<T>(object: unknown | Roact.Binding<T>): object is Roact.Binding<T> {
    // check if it is a table
    if (!typeIs(object, "table")) {
      return false;
    }
    // simple but exploitable, I will find a way how to do this
    return StringUtils.startsWith(tostring(object), "RoactBinding");
  }
}
