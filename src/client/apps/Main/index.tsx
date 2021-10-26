import Roact, { Component } from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import { Dispatch } from "@rbxts/rodux";
import { ClientStoreActions, ClientStoreState } from "client/store/store";
import Toolbar from "./toolbar";

interface Props extends MappedProps, MappedDispatch {}

interface MappedProps {}
interface MappedDispatch {}

const mapStateToProps = (state: ClientStoreState): MappedProps => {
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<ClientStoreActions>): MappedDispatch => {
	return {};
};

const MainPage = connect(
	mapStateToProps,
	mapDispatchToProps,
)(
	class MainPage extends Component<Props> {
		public render() {
			return (
				<>
					<Toolbar AnchorPoint={new Vector2(0.5, 1)} Position={new UDim2(0.5, 0, 1, -10)} Hidden={false} />
				</>
			);
		}
	},
);

export default MainPage;
