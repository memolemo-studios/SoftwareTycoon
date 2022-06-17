import { GlobalEvents } from "shared/remotes/events";
import { GlobalFunctions } from "shared/remotes/functions";

/**
 * Wrapper of `GlobalEvents.client`.
 */
export const Events = GlobalEvents.client;

/**
 * Wrapper of `GlobalFunctions.client`.
 */
export const Functions = GlobalFunctions.client;
