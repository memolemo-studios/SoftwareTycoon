import Roact, { Component } from "@rbxts/roact";
import { ClientApp } from "client/controllers/AppController";

@ClientApp({})
export default class MainApp extends Component {
	public render() {
		return <textlabel Size={UDim2.fromOffset(200, 50)} Text="Hello Roact!" />;
	}
}
