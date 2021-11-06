import { Bin } from "@rbxts/bin";
import Signal from "shared/classes/signal";
import Keyboard from "./keyboard";

// it is not considered as Controller in Flamework.
export default class MovementController {
	private bin = new Bin();
	private keyboard = new Keyboard();

	public onMove = new Signal<(x: number, y: number) => void>();

	private changeX = 0;
	private changeZ = 0;

	public constructor(public sensitivity: number) {
		this.start();
	}

	private updateKeyPresses() {
		if (
			this.keyboard.areAnyKeysDown(Enum.KeyCode.W, Enum.KeyCode.S) &&
			!this.keyboard.areKeysDown(Enum.KeyCode.W, Enum.KeyCode.S)
		) {
			if (this.keyboard.isKeyDown(Enum.KeyCode.W)) {
				this.changeZ = 1;
			}
			if (this.keyboard.isKeyDown(Enum.KeyCode.S)) {
				this.changeZ = -1;
			}
		} else {
			this.changeZ = 0;
		}
		if (
			this.keyboard.areAnyKeysDown(Enum.KeyCode.A, Enum.KeyCode.D) &&
			!this.keyboard.areKeysDown(Enum.KeyCode.A, Enum.KeyCode.D)
		) {
			if (this.keyboard.isKeyDown(Enum.KeyCode.A)) {
				this.changeX = 1;
			}
			if (this.keyboard.isKeyDown(Enum.KeyCode.D)) {
				this.changeX = -1;
			}
		} else {
			this.changeX = 0;
		}
		this.onMove.Fire(this.changeX, this.changeZ);
	}

	private start() {
		this.bin.add(this.keyboard.keyDown.Connect(() => this.updateKeyPresses()));
		this.bin.add(this.keyboard.keyUp.Connect(() => this.updateKeyPresses()));
	}

	public destroy() {
		this.bin.destroy();
	}
}
