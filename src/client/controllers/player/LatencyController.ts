import { Controller, OnInit, OnTick } from "@flamework/core";
import Log from "@rbxts/log";
import { Players } from "@rbxts/services";
import { Cache } from "shared/classes/cache";
import { GameFlags } from "shared/flags";
import Remotes from "shared/remotes/game";
import { LatencyErrors } from "types/game/latency";

const local_user_id = Players.LocalPlayer.UserId;
let ping_time = 0;

@Controller({})
export class LatencyController implements OnInit, OnTick {
  private logger = Log.ForContext(LatencyController);

  private recieverRemote = Remotes.Client.Get("ClientSendPing");
  private senderRemote = Remotes.Client.Get("ClientRecievePing");
  private getPlayerLatencyRemote = Remotes.Client.Get("GetPlayerPing");

  /**
   * Tries to get a targeted player's current latency
   * @param target A target player's userId or local player's userid
   */
  public getPlayerLatency(target = local_user_id) {
    return new Promise<number>((resolve, reject) => {
      this.getPlayerLatencyRemote
        .CallServerAsync(target)
        .then(res => {
          if (res.success) return resolve(res.value);
          reject(this.makeMessageFromError(res.reason));
        })
        .catch(reason => reject(reason));
    }).catch(reason => {
      this.logger.Warn("Failed to get the current ping ({Reason})", reason);
      return ping_time;
    });
  }

  private makeMessageFromError(error_kind: LatencyErrors) {
    switch (error_kind) {
      case LatencyErrors.PlayerNotFound:
        return "{Player} doesn't exists!";
      default:
        return "Unexpected error!";
    }
  }

  private pingCache = new Cache("ping_cache", () => this.getPlayerLatency());

  /** @hidden */
  public onTick() {
    // only perform this if EnablePlayerLatency flag is enabled
    if (GameFlags.EnablePlayerLatency === false) return;

    // update it if neccessary
    if (this.pingCache.needsUpdate()) {
      this.logger.Verbose("Updating client's ping time");
      this.pingCache.updateValue();
    }
  }

  /** @hidden */
  public onInit() {
    // latency remotes
    this.senderRemote.Connect((startTick, uuid) => {
      // get the ping difference
      ping_time = os.clock() - startTick;

      // recieving back to the reciever remote
      this.recieverRemote.SendToServer(startTick, uuid);
    });
  }
}
