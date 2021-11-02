import { Bin } from "@rbxts/bin";
import { UserInputService } from "@rbxts/services";
import Signal from "@rbxts/signal";

export default class Keyboard {
	private bin = new Bin();

	public keyDown = new Signal<(keycode: Enum.KeyCode) => void>();
	public keyUp = new Signal<(keycode: Enum.KeyCode) => void>();

	public constructor() {
		this.bin.add(
			UserInputService.InputBegan.Connect((input, processed) => {
				if (processed) return;
				if (input.UserInputType === Enum.UserInputType.Keyboard) {
					this.keyDown.Fire(input.KeyCode);
				}
			}),
		);
		this.bin.add(
			UserInputService.InputEnded.Connect((input, processed) => {
				if (processed) return;
				if (input.UserInputType === Enum.UserInputType.Keyboard) {
					this.keyUp.Fire(input.KeyCode);
				}
			}),
		);
	}

	public isKeyDown(keycode: Enum.KeyCode) {
		return UserInputService.IsKeyDown(keycode);
	}

	public areKeysDown(keycodes: Enum.KeyCode[]) {
		return keycodes.every(keycode => this.isKeyDown(keycode));
	}

	public areAnyKeysDown(keycodes: Enum.KeyCode[]) {
		return keycodes.some(keycode => this.isKeyDown(keycode));
	}

	public isLocked() {
		return UserInputService.MouseBehavior !== Enum.MouseBehavior.Default;
	}

	public lock() {
		UserInputService.MouseBehavior = Enum.MouseBehavior.LockCurrentPosition;
	}

	public lockAtCenter() {
		UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;
	}

	public unlock() {
		UserInputService.MouseBehavior = Enum.MouseBehavior.Default;
	}

	public destroy() {
		this.bin.destroy();
	}
}
