import { Controller, OnStart } from "@flamework/core";
import { makeHello } from "shared/module";

/**
 * Testing controller to make sure this game works.
 *
 * **WILL BE REMOVED IN THE FUTURE ONCE IT IS MERGED TO DEV**
 */
@Controller({})
export class MyController implements OnStart {
  /** @hidden */
  public onStart(): void {
    print(makeHello("client/controllers/MyController.ts"));
  }
}
