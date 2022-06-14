import { Modding } from "@flamework/core";

/**
 * Makes a set of listeners automatically without
 * doing a labor magic to Flamework.
 *
 * @metadata macro
 */
export function makeListenersSet<T>(obj?: Modding.Generic<T, "id">) {
  assert(obj);

  const set = new Set<T>();
  Modding.onListenerAdded<T>((obj) => set.add(obj), obj.id);
  Modding.onListenerRemoved<T>((obj) => set.delete(obj), obj.id);

  return set;
}
