import { Dependency } from "@flamework/core";
import Roact, { Component } from "@rbxts/roact";
import { ClientApp } from "client/controllers/AppController";
import { PlacementController } from "client/controllers/PlacementController";
import BaseButton from "interface/button/base";
import CenterHorizontalConstraint from "interface/constraints/list/centerHorizontal";
import XYPadding from "interface/constraints/padding/xy";
import MainToolbar from "./Toolbar";

// this is temporary for awhile
function ToolbarButton(props: Roact.PropsWithChildren<{ onClick?: () => void }>) {
	return (
		<BaseButton Size={UDim2.fromOffset(60, 60)} OnClick={props.onClick}>
			<textlabel
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
				Text="Hello world!"
				Font={Enum.Font.SourceSansBold}
				TextSize={18}
				TextWrapped={true}
			/>
		</BaseButton>
	);
}

@ClientApp({})
export default class MainApp extends Component {
	public render() {
		// I have no idea what result will be because roblox is down for more than 12 hours!
		return (
			<MainToolbar
				AnchorPoint={new Vector2(0.5, 1)}
				Position={new UDim2(0.5, 0, 1, -10)}
				Size={UDim2.fromOffset(340, 70)}
				Hidden={false}
			>
				<XYPadding offsetX={8} />
				<CenterHorizontalConstraint Pading={new UDim(0, 8)} />
				<ToolbarButton onClick={() => Dependency<PlacementController>().startPlacement()} />
				<ToolbarButton />
				<ToolbarButton />
				<ToolbarButton />
				<ToolbarButton />
			</MainToolbar>
		);
	}
}
