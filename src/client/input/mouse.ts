import { Bin } from "@rbxts/bin";
import { Option } from "@rbxts/rust-classes";
import { UserInputService, Workspace } from "@rbxts/services";
import Signal from "@rbxts/signal";

export default class Mouse {
	private bin = new Bin();

	public leftDown = new Signal();
	public leftUp = new Signal();

	public rightDown = new Signal();
	public rightUp = new Signal();

	public scrolled = new Signal<(velocity: number) => number>();

	public constructor(sensitivity?: number) {
		sensitivity = math.clamp(sensitivity ?? 0.5, 0, 1);
		this.bin.add(
			UserInputService.InputBegan.Connect((input, processed) => {
				if (processed) return;
				switch (input.UserInputType) {
					case Enum.UserInputType.MouseButton1:
						this.leftDown.Fire();
						break;
					case Enum.UserInputType.MouseButton2:
						this.rightDown.Fire();
						break;
					default:
						break;
				}
			}),
		);
		this.bin.add(
			UserInputService.InputEnded.Connect((input, processed) => {
				if (processed) return;
				switch (input.UserInputType) {
					case Enum.UserInputType.MouseButton1:
						this.leftUp.Fire();
						break;
					case Enum.UserInputType.MouseButton2:
						this.rightUp.Fire();
						break;
					default:
						break;
				}
			}),
		);
		this.bin.add(
			UserInputService.InputChanged.Connect((input, processed) => {
				if (processed) return;
				if (input.UserInputType === Enum.UserInputType.MouseWheel) {
					this.scrolled.Fire(input.Position.Z * sensitivity!);
				}
			}),
		);
	}

	public isLeftDown() {
		return UserInputService.IsMouseButtonPressed(Enum.UserInputType.MouseButton1);
	}

	public isRightDown() {
		return UserInputService.IsMouseButtonPressed(Enum.UserInputType.MouseButton2);
	}

	public getPosition() {
		return UserInputService.GetMouseLocation();
	}

	public getRay(overridePos?: Vector2) {
		const { X, Y } = overridePos ?? this.getPosition();
		return Workspace.CurrentCamera!.ViewportPointToRay(X, Y);
	}

	public raycast(params?: RaycastParams, distance?: number, overridePos?: Vector2) {
		const viewport_mouse_ray = this.getRay(overridePos);
		const result = Workspace.Raycast(
			viewport_mouse_ray.Origin,
			viewport_mouse_ray.Direction.mul(distance ?? 1000),
			params,
		);
		return Option.wrap(result);
	}

	public lock() {
		UserInputService.MouseBehavior = Enum.MouseBehavior.LockCurrentPosition;
	}

	public lockCenter() {
		UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;
	}

	public unlock() {
		UserInputService.MouseBehavior = Enum.MouseBehavior.Default;
	}

	public destroy() {
		this.bin.destroy();
	}
}
