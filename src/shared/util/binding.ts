import { SingleMotor } from "@rbxts/flipper";
import { createBinding } from "@rbxts/roact";

export namespace BindingUtil {
	/** Makes a Roact binding from Flipper's SingleMotor class */
	export function makeBindingFromMotor(motor: SingleMotor) {
		const [binding, setBinding] = createBinding(motor.getValue());
		motor.onStep(setBinding);
		return binding;
	}
}
