import { Flamework, OnInit, OnStart, Reflect, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import { LocalStorage } from "server/classes/localStorage";
import Remotes from "shared/remotes/game";
import { FlameworkUtil } from "shared/utils/flamework";
import { PlayerData } from "types/game/data";
import { LocalStorageService } from "../replication/LocalStorageService";
import { PlayerDataProfile, PlayerDataService } from "./PlayerDataService";

/** Hook into the OnPlayerJoined event */
export interface OnPlayerJoined {
  /**
   * This function will be called whenever the player joins the game.
   *
   * This should only used to setup if you want to grab player's data
   * instead of waiting player's data to be loaded from ProfileService.
   */
  onPlayerJoined(player: Player, profile: PlayerDataProfile): void;
}

/** Hook into the OnPlayerLeft event */
export interface OnPlayerLeft {
  /**
   * This function will be called whenever the player leaves the game.
   */
  onPlayerLeft(player: Player): void;
}

@Service({})
export class PlayerService implements OnInit, OnStart {
  private logger = Log.ForContext(PlayerService);
  private playerProfiles = new Map<Player, PlayerDataProfile>();
  private requestSpawnRemote = Remotes.Server.Create("RespawnPlayer");

  private playerJoinObjs!: Map<string, OnPlayerJoined>;
  private playerLeftObjs!: Map<string, OnPlayerLeft>;

  private dataContainerStorage!: LocalStorage<"PlayerData">;

  public constructor(private dataService: PlayerDataService, private localStorageService: LocalStorageService) {}

  /** Tries to update player's data */
  public updatePlayerData(player: Player, override?: PlayerData) {
    this.dataContainerStorage.updatePlayerContainer(player, override);
  }

  private async onPlayerAdded(player: Player) {
    // trying to get player's profile
    const profile = await this.dataService.loadPlayerProfile(player);
    if (profile === undefined) return;

    // register player in the local storage
    this.dataContainerStorage.createPlayerContainer(player, profile.Data);

    // release profile event for removing that player in profiles map
    profile.ListenToRelease(() => {
      this.playerProfiles.delete(player);
    });

    // register this player to the map
    this.playerProfiles.set(player, profile);
    this.logger.Info("{@Player} has been logged in to the game", player);

    // firing every hookers
    for (const [, dependency] of this.playerJoinObjs) {
      task.spawn(() => dependency.onPlayerJoined(player, profile));
    }
  }

  private onPlayerRemoving(player: Player) {
    this.logger.Info("{@Player} left the game", player);

    // to avoid some race conditions
    task.spawn(() => {
      // releasing their profile
      this.playerProfiles.get(player)?.Release();
    });

    // firing every hookers
    for (const [, dependency] of this.playerLeftObjs) {
      task.spawn(() => dependency.onPlayerLeft(player));
    }
  }

  /** Gets player's profile */
  public getPlayerProfile(player: Player) {
    return Option.wrap(this.playerProfiles.get(player));
  }

  /** @hidden */
  public onInit() {
    // getting PlayerService hookers
    this.playerJoinObjs = FlameworkUtil.getDependencySingletons(ctor => Flamework.implements<OnPlayerJoined>(ctor));
    this.playerLeftObjs = FlameworkUtil.getDependencySingletons(ctor => Flamework.implements<OnPlayerLeft>(ctor));

    // local storage initialization
    this.dataContainerStorage = this.localStorageService.addLocalStorage("PlayerData");

    // players service stuff
    Players.PlayerAdded.Connect(p => this.onPlayerAdded(p));
    Players.PlayerRemoving.Connect(p => this.onPlayerRemoving(p));

    // remotes
    this.requestSpawnRemote.SetCallback(player => {
      // do not accept if the player is already spawned
      if (player.Character) {
        return { success: false, reason: "" };
      }
      player.LoadCharacter();
      return { success: true, value: "" };
    });
  }

  /** @hidden */
  public onStart() {
    // firing players who joined before Flamework starts
    for (const player of Players.GetPlayers()) {
      task.spawn((p: Player) => this.onPlayerAdded(p), player);
    }
  }
}
