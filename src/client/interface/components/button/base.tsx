import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact, { Binding, Component } from "@rbxts/roact";
import withBundle from "client/interface/functions/withBundle";
import { GetSoundManager, SoundManager } from "shared/flamework/SoundManager";
import { OrBinding } from "shared/types/roact";
import { makeBindingFromMotor } from "shared/util/binding";

let sound_manager: SoundManager;

function loadSoundManager() {
	sound_manager ?? (sound_manager = GetSoundManager());
}

interface Props {
	Position?: OrBinding<UDim2>;
	Size?: OrBinding<UDim2>;
	DisableSounds?: boolean;
	AnchorPoint?: OrBinding<Vector2>;
	LayoutOrder?: OrBinding<number>;
	BackgroundTransparency?: number;
	OnClick?: (rbx: TextButton, inputObject: InputObject, clickCount: number) => void;
}

export default class BaseButton extends Component<Props> {
	private hoverMotor: SingleMotor;
	private hoverBinding: Binding<number>;

	public constructor(props: Props) {
		super(props);

		this.hoverMotor = new SingleMotor(0);
		this.hoverBinding = makeBindingFromMotor(this.hoverMotor);
	}

	public makeSpring(value: number) {
		return new Spring(value, {
			frequency: 5,
			dampingRatio: 1,
		});
	}

	public render() {
		return withBundle((settings, providedTheme) => {
			const theme = providedTheme.MainButton;
			return (
				<textbutton
					AutoButtonColor={false}
					BackgroundColor3={this.hoverBinding.map(alpha => {
						return theme.Background.Lerp(theme.HoveredColor, alpha);
					})}
					Size={this.props.Size}
					Position={this.props.Position}
					AnchorPoint={this.props.AnchorPoint}
					BackgroundTransparency={this.props.BackgroundTransparency}
					LayoutOrder={this.props.LayoutOrder}
					Event={{
						Activated: (rbx, inputObj, clickCount) => {
							if (!this.props.DisableSounds || settings.SoundsEnabled) {
								loadSoundManager();

								const click_sound_result = sound_manager.playSoundFileImmediately("button_click");
								if (click_sound_result.isErr()) {
									warn(
										`[BaseButton]: Unable to play sound: ${click_sound_result.unwrapErr().message}`,
									);
								}
							}
							// forms a mouse click sound
							this.props.OnClick?.(rbx, inputObj, clickCount);
						},
						MouseEnter: () => this.hoverMotor.setGoal(this.makeSpring(1)),
						MouseLeave: () => this.hoverMotor.setGoal(this.makeSpring(0)),
					}}
					Text=""
				>
					<uicorner CornerRadius={new UDim(0, 8)} />
					{this.props[Roact.Children]}
				</textbutton>
			);
		});
	}
}
