import Roact, { Component } from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import { Dispatch } from "@rbxts/rodux";
import BaseButton from "client/interface/components/button/base";
import XYPadding from "client/interface/components/constraints/padding/xy";
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
					<Toolbar AnchorPoint={new Vector2(0.5, 1)} Position={new UDim2(0.5, 0, 1, -10)} Hidden={false}>
						<XYPadding offsetX={7} />
						<uilistlayout
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							FillDirection={"Horizontal"}
							Padding={new UDim(0, 7)}
						/>
						<BaseButton Size={UDim2.fromOffset(60, 60)}>
							<textlabel
								BackgroundTransparency={1}
								Size={UDim2.fromScale(1, 1)}
								Text="Hello world!"
								Font={Enum.Font.SourceSansBold}
								TextSize={18}
								TextWrapped={true}
							/>
						</BaseButton>
						<BaseButton Size={UDim2.fromOffset(60, 60)}>
							<textlabel
								BackgroundTransparency={1}
								Size={UDim2.fromScale(1, 1)}
								Text="Hello world!"
								Font={Enum.Font.SourceSansBold}
								TextSize={18}
								TextWrapped={true}
							/>
						</BaseButton>
						<BaseButton Size={UDim2.fromOffset(60, 60)}>
							<textlabel
								BackgroundTransparency={1}
								Size={UDim2.fromScale(1, 1)}
								Text="Hello world!"
								Font={Enum.Font.SourceSansBold}
								TextSize={18}
								TextWrapped={true}
							/>
						</BaseButton>
						<BaseButton Size={UDim2.fromOffset(60, 60)}>
							<textlabel
								BackgroundTransparency={1}
								Size={UDim2.fromScale(1, 1)}
								Text="Hello world!"
								Font={Enum.Font.SourceSansBold}
								TextSize={18}
								TextWrapped={true}
							/>
						</BaseButton>
						<BaseButton Size={UDim2.fromOffset(60, 60)}>
							<textlabel
								BackgroundTransparency={1}
								Size={UDim2.fromScale(1, 1)}
								Text="Hello world!"
								Font={Enum.Font.SourceSansBold}
								TextSize={18}
								TextWrapped={true}
							/>
						</BaseButton>
					</Toolbar>
					<BaseButton Size={UDim2.fromOffset(200, 50)} />
				</>
			);
		}
	},
);

export default MainPage;
