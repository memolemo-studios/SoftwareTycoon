import { GameFlags } from "shared/flags";

export = (_: unknown, key: string, value: defined) => {
  try {
    GameFlags.setEntry(key as keyof GameFlags, value as GameFlags[keyof GameFlags]);
    return "Succesfully set %s flag to %s".format(tostring(key), tostring(value));
  } catch (err) {
    return "Unable to set %s flag: %s".format(tostring(key), tostring(err));
  }
};
