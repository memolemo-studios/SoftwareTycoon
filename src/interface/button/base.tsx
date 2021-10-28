import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact, { Binding, Component, JsxInstance } from "@rbxts/roact";
import { withSettings } from "interface/context/settings";
import { getAssetServices } from "interface/util/asset";
import { BindingUtil } from "shared/util/binding";

export interface BaseButtonProps
	extends Omit<JsxInstance<TextButton>, "BackgroundColor3" | "AutoButtonColor" | "Text"> {
	BaseColor?: Color3;
	HoveredColor3?: Color3;
	SoundsEnabled?: boolean;
	OnClick?: (rbx: TextButton, inputObject: InputObject, clickCount: number) => void;
}

/** BaseButton */
export default class BaseButton extends Component<BaseButtonProps> {
	private hoverMotor: SingleMotor;
	private hoverBinding: Binding<number>;

	public constructor(props: BaseButtonProps) {
		super(props);

		this.hoverMotor = new SingleMotor(0);
		this.hoverBinding = BindingUtil.makeBindingFromMotor(this.hoverMotor);
	}

	private setMotor(float: number) {
		this.hoverMotor.setGoal(
			new Spring(float, {
				frequency: 5,
				dampingRatio: 1,
			}),
		);
	}

	private playClickSound() {
		const { SoundManager, AssetManager } = getAssetServices();
		const click_asset_id = "button_click";
		AssetManager.getAssetIdFromSoundName(click_asset_id).match(
			id => SoundManager.createSoundFile(click_asset_id, id).play(),
			() => warn(`Unable to play because '${click_asset_id}' does not exists`),
		);
	}

	public render() {
		return withSettings(settings => {
			const spread_props = { ...this.props };
			spread_props[Roact.Children] = undefined;
			spread_props.SoundsEnabled = undefined;
			spread_props.OnClick = undefined;
			spread_props.BaseColor = undefined;
			spread_props.HoveredColor3 = undefined;
			return (
				<textbutton
					AutoButtonColor={false}
					BackgroundColor3={this.hoverBinding.map(alpha => {
						return (
							this.props.BaseColor?.Lerp(this.props.HoveredColor3 ?? new Color3(), alpha) ?? new Color3()
						);
					})}
					Event={{
						Activated: (rbx, input, count) => {
							// click sound
							if (settings.SoundsEnabled && (this.props.SoundsEnabled ?? true)) {
								this.playClickSound();
							}
							this.props.OnClick?.(rbx, input, count);
						},
						MouseEnter: () => this.setMotor(1),
						MouseLeave: () => this.setMotor(0),
					}}
					Text=""
					{...spread_props}
				>
					{this.props[Roact.Children]}
				</textbutton>
			);
		});
	}
}
