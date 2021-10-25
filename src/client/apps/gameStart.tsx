import Roact, { Component } from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import { Dispatch } from "@rbxts/rodux";
import { withTransparency } from "client/interface/components/context/transparency";
import FadeBackgroundFrame from "client/interface/components/frame/background/fade";
import { ClientStoreActions, ClientStoreState } from "client/store/store";
import { AppState } from "shared/types/enums/store/apps";

interface Props extends MappedProps, MappedDispatch {}

interface MappedProps {
	visible: boolean;
}

interface MappedDispatch {}

const mapStateToProps = (state: ClientStoreState): MappedProps => {
	return {
		visible: state.app.state === AppState.GameStart,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<ClientStoreActions>): MappedDispatch => {
	return {};
};

const GameStart = connect(
	mapStateToProps,
	mapDispatchToProps,
)(
	class extends Component<Props> {
		public render() {
			return (
				<FadeBackgroundFrame color={new Color3()} tweenMethod="Linear" visible={this.props.visible}>
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
