import Roact, { Component } from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import { Dispatch } from "@rbxts/rodux";
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
		}

		public render() {
			return <></>;
		}
	},
);

export default GameStart;
