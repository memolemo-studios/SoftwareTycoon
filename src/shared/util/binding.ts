import { SingleMotor } from "@rbxts/flipper";
import { createBinding } from "@rbxts/roact";

export function makeBindingFromMotor(motor: SingleMotor) {
	const [binding, set_binding] = createBinding(motor.getValue());
	motor.onStep(set_binding);

	return binding;
}
