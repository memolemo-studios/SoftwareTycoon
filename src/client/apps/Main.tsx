import Roact, { Component } from "@rbxts/roact";
import { ClientApp } from "client/controllers/AppController";
import BaseButton from "interface/button/base";

@ClientApp({})
export default class MainApp extends Component {
	public render() {
		return <BaseButton Size={UDim2.fromOffset(200, 50)} />;
	}
}
