import { OnInit, OnStart, Reflect, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { Profile } from "@rbxts/profileservice/globals";
import { Option } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import { PlayerEntity } from "server/entities/player";
import { PlayerData } from "types/player";
import { makeListenersSet } from "shared/macros/flamework";
import { PlayerDataService } from "./PlayerDataService";
import { KickSeverity, PlayerKickHandler } from "shared/singletons/PlayerKickHandler";
import { Functions } from "server/remotes";

/**
 * Hooks into the `OnPlayerJoin` lifecycle event.
 */
export interface OnPlayerJoin {
  /**
   * This method will run whenever the player joins the server
   * and it guarantees to load their profile successfully.
   */
  onPlayerJoin(entity: PlayerEntity): void;
}

/**
 * Hooks into the `OnPlayerLeave` lifecycle event.
 */
export interface OnPlayerLeave {
  /**
   * This method will run whenever the player leaves the game.
   *
   * However at the same time, the player's profile is also being
   * released. Mutating player's profile will result of unexpected
   * data losses.
   */
  onPlayerLeave(player: Player): void;
}

/**
 * This service is responsible for managing players and
 * allows to retrieve player's entity (PlayerEntity).
 */
@Service({})
export class PlayerService implements OnInit, OnStart {
  private joinListeners = makeListenersSet<OnPlayerJoin>();
  private leaveListeners = makeListenersSet<OnPlayerLeave>();

  private entities = new Map<Player, PlayerEntity>();
  private logger = Log.ForContext(PlayerService);

  public constructor(
    private readonly playerDataService: PlayerDataService,
    private readonly playerKickHandler: PlayerKickHandler,
  ) {}

  /**
   * Gets the player's entity from the player parameter.
   * @param player Player to get their entity
   * @returns Undefined or defined type of PlayerEntity wrapped with Option.
   */
  public getEntity(player: Player): Option<PlayerEntity> {
    // @ts-ignore
    return Option.wrap(this.entities.get(player));
  }

  // `PlayerDataService::LoadProfileAsync` returns as a Result type
  // it will be messy if we use Result match inside this method.
  private onPlayerJoin(player: Player, profile: Profile<PlayerData>) {
    this.logger.Info("{@Player} logged in successfully", player);
    this.logger.Verbose("Registering player entity for {@Player}", player);

    const entity = new PlayerEntity(player, profile);
    this.entities.set(player, entity);

    profile.ListenToRelease(() => {
      // if this line removed, the player would kick the game
      // but they already left the game.
      if (!player.IsDescendantOf(Players)) return;
      this.playerKickHandler.KickSafe(
        player,
        KickSeverity.FailedButFixable,
        "You should have gone left the game (data already released)",
      );
    });

    for (const listener of this.joinListeners) {
      const identifier = Reflect.getMetadata(listener, "identifier");
      assert(typeIs(identifier, "string"), "A listener (OnPlayerJoin) doesn't have an identifier");
      task.spawn(() => {
        debug.setmemorycategory(`${identifier}::OnPlayerJoin`);
        listener.onPlayerJoin(entity);
      });
    }
  }

  private onPlayerLeave(player: Player) {
    this.logger.Info("{@Player} left the game", player);
    this.entities.get(player)?.Bin.destroy();
    this.entities.delete(player);

    for (const listener of this.leaveListeners) {
      const identifier = Reflect.getMetadata(listener, "identifier");
      assert(typeIs(identifier, "string"), "A listener (OnPlayerLeave) doesn't have an identifier");
      task.spawn(() => {
        debug.setmemorycategory(`${identifier}::OnPlayerLeave`);
        listener.onPlayerLeave(player);
      });
    }
  }

  /** @hidden */
  public onInit() {
    Functions.RequestPlayerData.setCallback((player) =>
      this.getEntity(player).match(
        (profile) => profile.Data,
        () => {
          Log.Error("{@Player} requested data but it isn't loaded yet.", player);
          error("Data is not loaded from server");
        },
      ),
    );
  }

  /** @hidden */
  public onStart() {
    // TODO(memothelemo): this is a sign of code duplication
    // i need this to refactor it when I have time to do that.
    const onPlayerJoinInner = (player: Player) => {
      this.logger.Debug("{@Player} joins the game. Attempting to load the profile", player);
      this.playerDataService
        .LoadProfileAsync(player)
        .then((profile) =>
          profile.match<void>(
            (profile) => this.onPlayerJoin(player, profile),
            (err) => this.playerDataService.KickPlayerWithErr(player, err),
          ),
        )
        .catch((reason) => this.playerDataService.KickPlayerWithErr(player, reason));
    };

    for (const player of Players.GetPlayers()) {
      task.spawn(onPlayerJoinInner, player);
    }

    Players.PlayerAdded.Connect(onPlayerJoinInner);
    Players.PlayerRemoving.Connect((p) => this.onPlayerLeave(p));
  }
}
