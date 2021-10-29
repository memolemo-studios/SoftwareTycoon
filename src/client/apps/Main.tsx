import Roact, { Component } from "@rbxts/roact";
import { ClientApp } from "client/controllers/AppController";
import BaseButton from "interface/button/base";
import MainButton from "interface/button/main";

@ClientApp({})
export default class MainApp extends Component {
	public render() {
		return <MainButton Size={UDim2.fromOffset(200, 200)} />;
	}
}
