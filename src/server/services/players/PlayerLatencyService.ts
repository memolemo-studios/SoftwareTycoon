import { OnInit, OnTick, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { HttpService, Players } from "@rbxts/services";
import { GameFlags } from "shared/flags";
import Remotes from "shared/remotes/game";
import { LatencyErrors } from "types/game/latency";
import { RemoteResponse } from "types/response";
import { PlayerKickService, PlayerKickReasons } from "./PlayerKickService";
import { OnPlayerJoined, OnPlayerLeft } from "./PlayerService";

interface RequestInfo {
  uuid: string;
  tickTime: number;
}

@Service({})
export class PlayerLatencyService implements OnInit, OnTick, OnPlayerJoined, OnPlayerLeft {
  private logger = Log.ForContext(PlayerLatencyService);

  private recieverRemote = Remotes.Server.Create("ClientSendPing");
  private senderRemote = Remotes.Server.Create("ClientRecievePing");
  private getterRemote = Remotes.Server.Create("GetPlayerPing");

  private requestInfos = new Map<Player, RequestInfo>();
  private latencyPerPlayer = new Map<Player, number>();

  private lastHeartbeatTick = os.clock();

  public constructor(private kickService: PlayerKickService) {}

  /**
   * Net wrapper and automatically kicks the player if
   * the following arguments are invalid.
   */
  private withLatencyWrapper(callback: (player: Player, info: RequestInfo, recieveTick: number) => void) {
    return (player: Player, tickTime: number, uuid: string) => {
      const info = this.requestInfos.get(player);
      const recieve_tick = os.clock();

      // kick the player if it is not requested (ddos attack?)
      if (info === undefined) {
        return this.kickService.kickPlayerWithReason(player, PlayerKickReasons.Exploit);
      }

      // checking for any matches
      const are_matched = info.tickTime === tickTime && info.uuid === uuid;
      if (!are_matched) {
        return this.kickService.kickPlayerWithReason(player, PlayerKickReasons.Exploit);
      }

      // done!
      callback(player, info, recieve_tick);
    };
  }

  /**
   * Perform a latency routine but player only.
   *
   * **NOTES**:
   * - It will interfere the existing pending request.
   * - It would be possibly for the player to be kicked because of
   * that change
   */
  private doRoutineOnPlayer(player: Player) {
    const start_tick = os.clock();
    const uuid = HttpService.GenerateGUID(false);
    this.requestInfos.set(player, {
      uuid,
      tickTime: start_tick,
    });
    this.senderRemote.SendToPlayer(player, start_tick, uuid);
  }

  /**
   * Does a latency routine by sending a request to every client (players)
   * for calling it back.
   */
  private doRoutine() {
    for (const player of Players.GetPlayers()) {
      // making sure the server isn't requesting again
      if (this.requestInfos.has(player)) continue;
      this.doRoutineOnPlayer(player);
    }
  }

  /** @hidden */
  public onPlayerLeft(player: Player) {
    // clearing it up!
    this.latencyPerPlayer.delete(player);
    this.requestInfos.delete(player);
  }

  /** Helper method returns if the player is currently lagging out the game */
  public isPlayerLagging(player: Player) {
    // get the pending request and check for any Option<None> cases
    const pending_request = this.getPendingRequestDuration(player);

    // automatically returned as false, because it is already done
    if (pending_request.isNone()) return false;

    // 5 seconds is the minimum threshold for lagging time
    return pending_request.unwrap() > 5;
  }

  /** Gets the pending request duration from the player */
  public getPendingRequestDuration(player: Player) {
    return this.getPlayerRequestInfo(player).map(({ tickTime }) => {
      const current_tick = os.clock();
      return current_tick - tickTime;
    });
  }

  /** Gets the player's request info */
  public getPlayerRequestInfo(player: Player) {
    return Option.wrap(this.requestInfos.get(player));
  }

  /** Gets the player's current ping time */
  public getPlayerPing(player: Player) {
    return Option.wrap(this.latencyPerPlayer.get(player));
  }

  /** @hidden */
  public onTick() {
    // only perform this if EnablePlayerLatency flag is enabled
    if (GameFlags.EnablePlayerLatency === false) return;

    // get the current tick and get the difference of it
    const current_tick = os.clock();
    const difference = current_tick - this.lastHeartbeatTick;

    // only do routine if it is more than the INTERVAL
    if (difference < GameFlags.LatencyCheckInterval) return;
    this.lastHeartbeatTick = current_tick;
    this.doRoutine();
  }

  /** @hidden */
  public onPlayerJoined(player: Player) {
    // automatically set their latency to 0
    this.latencyPerPlayer.set(player, 0);
  }

  /** @hidden */
  public onInit() {
    // warn the server if EnablePlayerLatency is disabled
    if (GameFlags.EnablePlayerLatency === false) {
      this.logger.Warn("This server has no capability of handling players' latency");
    }

    // remote connections
    this.recieverRemote.Connect(
      this.withLatencyWrapper((player, info, recieve_tick) => {
        // get the time difference
        const difference = recieve_tick - info.tickTime;

        // that's it, we need to set the map
        this.latencyPerPlayer.set(player, difference);

        // delete it then
        this.requestInfos.delete(player);
      }),
    );

    this.getterRemote.SetCallback((_, target_user) => {
      const player = Players.GetPlayerByUserId(target_user);
      if (!player) {
        return { success: false, reason: LatencyErrors.PlayerNotFound };
      }
      return this.getPlayerPing(player).match<RemoteResponse<number, LatencyErrors>>(
        ping => ({ success: true, value: ping }),
        () => ({
          success: false,
          reason: LatencyErrors.PlayerNotFound,
        }),
      );
    });
  }
}
