import BaseMotor from "@rbxts/flipper/typings/BaseMotor";
import { Binding } from "@rbxts/roact";
import { useBinding } from "@rbxts/roact-hooked";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FakeMotor<T> = BaseMotor<T> & {
  AssignedBinding: Binding<T>;
};

/** Hooker function takes a flipper motor and returns to Roact binding. */
export function useFlipperMotor<T>(motor: BaseMotor<T>) {
  // get the current binding
  if ((motor as unknown as FakeMotor<T>).AssignedBinding !== undefined) {
    return (motor as unknown as FakeMotor<T>).AssignedBinding;
  }

  // create a new binding
  const [binding, set_binding] = useBinding<T>((motor as BaseMotor<T> & { getValue(): T }).getValue());
  motor.onStep(set_binding as (value: T) => void);
  (motor as FakeMotor<T>).AssignedBinding = binding;

  return binding;
}
