import Roact, { Component } from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import { Dispatch } from "@rbxts/rodux";
import { withTransparency } from "client/interface/components/context/transparency";
import FadeBackgroundFrame from "client/interface/components/frame/background/fade";
import { ClientStoreActions, ClientStoreState } from "client/store/store";
import { AppState } from "shared/types/enums/store/apps";

interface Props extends MappedProps, MappedDispatch {}

interface MappedProps {
	currentState: AppState;
}

interface MappedDispatch {}

interface State {
	rendered: boolean;
}

const mapStateToProps = (state: ClientStoreState): MappedProps => {
	return {
		currentState: state.app.state,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<ClientStoreActions>): MappedDispatch => {
	return {};
};

const GameStart = connect(
	mapStateToProps,
	mapDispatchToProps,
)(
	class extends Component<Props, State> {
		public constructor(props: Props) {
			super(props);
			this.setState({ rendered: this.canBeSeen() });
		}

		public canBeSeen() {
			return this.props.currentState === AppState.GameStart;
		}

		public didUpdate(lastProps: Props, lastState: State) {
			if (this.props.currentState !== lastProps.currentState || lastState.rendered !== this.state.rendered) {
				this.setState({ rendered: this.canBeSeen() });
			}
		}

		public render() {
			return (
				<FadeBackgroundFrame color={new Color3()} tweenMethod="Linear" visible={this.state.rendered}>
					{withTransparency(alpha => (
						<textlabel
							BackgroundTransparency={1}
							TextTransparency={alpha}
							Size={UDim2.fromScale(1, 1)}
							Text="Loading Game..."
							TextColor3={new Color3(1, 1, 1)}
							Font={Enum.Font.SourceSansBold}
							TextSize={48}
						/>
					))}
				</FadeBackgroundFrame>
			);
		}
	},
);

export default GameStart;
