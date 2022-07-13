import { Reflect } from "@flamework/core";

/**
 * Attempts to get the identifier of an object from
 * Flamework's reflect metadata.
 *
 * @param obj An object that Flamework has an identifier of it.
 * @returns A valid Flamework identifier or undefined
 */
export function getFlameworkIdentifier(obj: object): string | undefined {
  return Reflect.getMetadata<string | undefined>(obj, "identifier");
}
