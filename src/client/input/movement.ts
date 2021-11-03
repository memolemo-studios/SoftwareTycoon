import { Bin } from "@rbxts/bin";
import Signal from "@rbxts/goodsignal";
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

	private onKeyUp() {
		if (!this.keyboard.areAnyKeysDown(Enum.KeyCode.W, Enum.KeyCode.S)) {
			this.changeX = 0;
		}
		if (!this.keyboard.areAnyKeysDown(Enum.KeyCode.A, Enum.KeyCode.D)) {
			this.changeZ = 0;
		}
		this.onMove.Fire(this.changeX, this.changeZ);
	}

	private onKeyDown() {
		if (this.keyboard.isKeyDown(Enum.KeyCode.W)) {
			this.changeZ = 1;
		}
		if (this.keyboard.isKeyDown(Enum.KeyCode.S)) {
			this.changeZ = -1;
		}
		if (this.keyboard.isKeyDown(Enum.KeyCode.A)) {
			this.changeX = 1;
		}
		if (this.keyboard.isKeyDown(Enum.KeyCode.D)) {
			this.changeX = -1;
		}
		this.onMove.Fire(this.changeX, this.changeZ);
	}

	private start() {
		this.bin.add(this.keyboard.keyDown.Connect(() => this.onKeyDown()));
		this.bin.add(this.keyboard.keyUp.Connect(() => this.onKeyUp()));
	}

	public destroy() {
		this.bin.destroy();
	}
}
