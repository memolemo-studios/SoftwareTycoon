import { OnStart, Service } from "@flamework/core";
import { makeHello } from "shared/module";

/**
 * Testing service to make sure this game works
 *
 * **WILL BE REMOVED IN THE FUTURE ONCE IT IS MERGED TO DEV**
 */
@Service({})
export class MyService implements OnStart {
  /** @hidden */
  public onStart(): void {
    print(makeHello("server/services/MyService.ts"));
  }
}
