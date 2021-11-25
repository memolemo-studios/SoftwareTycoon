import { Bin } from "@rbxts/bin";
import { Dictionary } from "@rbxts/llama";
import Log, { Logger } from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import LocalStorageRemotes from "shared/remotes/localstorageRemotes";

export class LocalStorage<N extends keyof PlayerLocalStorage = keyof PlayerLocalStorage> {
  private bin = new Bin();
  private onChangedContainer = LocalStorageRemotes.Server.Create("OnChangedContainer");

  private logger: Logger;
  private playersPerContainer = new Map<Player, PlayerLocalStorage[N]>();

  public constructor(public readonly name: N, private readonly template?: PlayerLocalStorage[N]) {
    this.logger = Log.ForContext(this);

    // automatic cleanup
    this.bin.add(
      Players.PlayerRemoving.Connect(plr => {
        if (this.playersPerContainer.has(plr)) this.playersPerContainer.delete(plr);
      }),
    );
  }

  /** Updates all player's storage containers at once */
  public updateAllPlayerContainers() {
    // some players who do not have that container
    for (const [player] of this.playersPerContainer) {
      this.updatePlayerContainer(player);
    }
  }

  /** Converts from class to string */
  public toString() {
    return `LocalStorage<${this.name}>`;
  }

  /**
   * Updates player's storage container
   *
   * This should be used whenever the player's storage container is
   * modified from the server.
   * @param player Player to update their storage container
   */
  public updatePlayerContainer(player: Player, override?: PlayerLocalStorage[N]) {
    let storage: PlayerLocalStorage[N] | undefined = override;
    if (storage === undefined) {
      const opt = this.getPlayerContainer(player).or(this.createPlayerContainer(player, override));
      if (opt.isSome()) {
        storage = opt.unwrap();
      }
    }

    // got an error, if it is undefined
    if (storage === undefined) {
      this.logger.Error(
        // prettier-ignore
        "Failed to update {@Player}'s storage container, "
					+ "their storage or the storage template is empty",
      );
      return;
    }

    // time to update that
    this.onChangedContainer.SendToPlayer(player, this.name, storage);
  }

  /**
   * Creates a new player's storage container from the template
   * or the value provided in the parameter.
   *
   * **FUNCTIONS**:
   * - If value parameter is not present, then it will
   * try to find the template. Lack of providing the template
   * may throw an error.
   * - If value parameter is present, it will automatically
   * goes to the player's container.
   *
   * @param player Player to create their own storage
   */
  public createPlayerContainer(player: Player, value?: PlayerLocalStorage[N]): Option<PlayerLocalStorage[N]> {
    // throw an error if there's no default template
    if (value === undefined && this.template === undefined) {
      this.logger.Error(
        "Failed to create {@Player}'s storage container because" +
          "there's no either the template or value parameter provided.",
        player,
      );
      return Option.none();
    }

    // avoid overriding player's container
    if (this.playersPerContainer.has(player)) {
      this.logger.Error("Failed to create existing {@Player}'s storage container", player);
      return Option.none();
    }
    this.logger.Debug("Creating storage container for {@Player}", player);

    // copying it even further to avoid template table overrides
    const template = Dictionary.copyDeep((value ?? this.template)!) as PlayerLocalStorage[N];

    // automatically create it then!
    this.playersPerContainer.set(player, template);

    // inform the player about that creation
    this.onChangedContainer.SendToPlayer(player, this.name, template);

    // work is now done!
    return Option.some(template);
  }

  /**
   * Attempts to get player's own storage container.
   */
  public getPlayerContainer(player: Player) {
    return Option.wrap(this.playersPerContainer.get(player));
  }
}
