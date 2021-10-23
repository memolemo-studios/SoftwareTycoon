import { Controller, OnStart } from "@flamework/core";

@Controller({})
export class TestController implements OnStart {
	public onStart() {
		print("Hello world, controller!");
	}
}
