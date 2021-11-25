import Log from "@rbxts/log";
import Net from "@rbxts/net";
import { ErrorHandler } from "@rbxts/net/out/middleware/TypeCheckMiddleware/types";
import { t } from "@rbxts/t";
import { LatencyErrors } from "types/game/latency";
import { LotRequestResponse } from "types/game/lot";
import { RemoteResponse } from "types/response";

const { Definitions: Def, Middleware: Mid } = Net;

// a function handles kicking stuff
const net_logger = Log.ForScript();
const handleError: ErrorHandler = (event, _, index) => {
  net_logger.Warn("Caught an invalid #{ArgumentId} argument in {EventName}!", index, event.GetInstance().Name);
};

/** Collection of remotes available to the game */
const Remotes = Def.Create({
  /** Attempts to request a lot to the server */
  RequestLot: Def.ServerAsyncFunction<() => LotRequestResponse<string>>(),

  /**
   * Gets the player's ping depending on the player
   * used from the parameter.
   */
  GetPlayerPing: Def.ServerAsyncFunction<(targetPlayer: number) => RemoteResponse<number, LatencyErrors>>([
    Mid.TypeChecking(t.intersection(t.integer, t.numberMin(0))).WithErrorHandler(handleError),
  ]),

  /**
   * Latency system response to client
   *
   * **Recieved arguments**: `[start_time, generated_id]`
   *
   * **Arguments**:
   *
   * `start_time` -> Tick time for sending client response
   *
   * `generated_id` -> Unique identifier provided from the server to prevent from exploits
   */
  ClientRecievePing: Def.ServerToClientEvent<[number, string]>(),

  /**
   * Latency system response to server
   *
   * **Recieved arguments**: `[start_time, generated_id]`
   *
   * **Arguments**:
   *
   * `start_time` -> Tick time for sending client response (only get this from RecievePing remote)
   *
   * `generated_id` -> Unique identifier provided from the server (only get this as well)
   *
   * **NOTE**: *If these arguments are incorrect, there's a possibility that the player might get kicked*
   */
  ClientSendPing: Def.ClientToServerEvent<[number, string]>([
    Mid.TypeChecking(t.number, t.string).WithErrorHandler(handleError),
  ]),
});

export default Remotes;
