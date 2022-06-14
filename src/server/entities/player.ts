import { Signal } from "@rbxts/beacon";
import { Bin } from "@rbxts/bin";
import Log from "@rbxts/log";
import { Profile } from "@rbxts/profileservice/globals";
import { Dictionary } from "@rbxts/sift";
import { PlayerData } from "types/player";
import { DeepReadonly } from "types/utils";

/**
 * Every player in the server is assigned as an entity.
 *
 * It allows to manage or mainpulate the player and it can only
 * be applied on server only.
 */
export class PlayerEntity {
  private logger = Log.ForContext(PlayerEntity);

  /**
   * This signal is invoked when the player's data is changed
   * by calling `PlayerEntity::updateData` method.
   *
   * @param data Player's new mutated data
   */
  public readonly OnDataChanged = new Signal<[data: DeepReadonly<PlayerData>]>();

  /**
   * Garbage collector of the object
   */
  public readonly Bin = new Bin();

  /**
   * Holds the player's data. It is readonly to prevent
   * unexpected mutations. If you want to change player's data,
   * consider using `updateData` with a callback argument.
   */
  public Data: DeepReadonly<PlayerData>;

  /**
   * The current holding instance of the entity.
   */
  public readonly Instance: Player;

  /**
   * Creates a new instance for PlayerEntity
   *
   * @param instance Holding instance to create PlayerEntity
   * @param profile Player's profile which can be retrieved by calling
   * 				  `PlayerDataService.loadProfileAsync`
   */
  public constructor(instance: Player, private profile: Profile<PlayerData>) {
    this.Instance = instance;
    this.Data = this.profile.Data;
    this.Bin.add(() => {
      this.logger.Verbose("Destroying player entity of {@Player}", instance);
      this.logger.Verbose("Releasing profile of {@Player}", instance);
      profile.Release();
    });
  }

  /**
   * Copies the current player's data and passed it through to a callback.
   * From there, you can do whatever you want to change the player's data.
   *
   * Once the callback is finished, it will override based on the parameter
   * and mutate it to player's profile.
   *
   * @param callback Callback to modify or mutate player's data inside
   */
  public UpdateData(callback: (data: PlayerData) => void) {
    // safe mutations
    const data = Dictionary.copyDeep(this.profile);
    callback(data);

    this.profile.Data = data;
    this.logger.Verbose("{@Player}'s data has been updated to {@NewData}", data);
    this.Data = data as DeepReadonly<PlayerData>;
    this.OnDataChanged.fire(this.Data);
  }
}
