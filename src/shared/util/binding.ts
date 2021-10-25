import { SingleMotor } from "@rbxts/flipper";
import { createBinding } from "@rbxts/roact";

export function makeBindingFromMotor(motor: SingleMotor) {
	const [binding, setBinding] = createBinding(motor.getValue());
	motor.onStep(setBinding);

	return binding;
}
