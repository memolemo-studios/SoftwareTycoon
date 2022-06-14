import { Controller, OnStart } from "@flamework/core";
import { makeHello } from "shared/module";

@Controller({})
export class MyController implements OnStart {
  /** @hidden */
  public onStart(): void {
    print(makeHello("client/controllers/MyController.ts"));
  }
}
