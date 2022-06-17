import { GlobalEvents } from "shared/remotes/events";
import { GlobalFunctions } from "shared/remotes/functions";

/**
 * Wrapper of `GlobalEvents.server`.
 */
export const Events = GlobalEvents.server;

/**
 * Wrapper of `GlobalFunctions.server`.
 */
export const Functions = GlobalFunctions.server;
