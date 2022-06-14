import { OnStart, Service } from "@flamework/core";
import { makeHello } from "shared/module";

@Service({})
export class MyService implements OnStart {
  /** @hidden */
  public onStart(): void {
    print(makeHello("server/services/MyService.ts"));
  }
}
