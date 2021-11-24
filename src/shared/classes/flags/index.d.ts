type ValidFlagEntries<T extends object> = {
  [K in keyof T]: K extends "setEntry" ? never : T[K] extends defined ? T[K] : never;
};

declare namespace FlagManager {
  export type ValidFlagManagerObject<T extends object> = ValidFlagEntries<T>;

  export type None = symbol & {
    /**
     * **DO NOT USE!**
     *
     * This field exists to force TypeScript to recognize this as a nominal type
     * @hidden
     * @deprecated
     */
    readonly _nominal_NoneFlagManager: unique symbol;
  };
}

type FlagManager<T extends object> = {
  readonly [K in keyof T]: T[K] extends FlagManager.None ? undefined : T[K];
} & {
  setEntry<K extends keyof T>(key: K, value: T[K]): void;

  getAllFlags(): (keyof T)[];

  isFlagExists(flag: string): boolean;
  isFlagExists<K extends keyof T>(flag: K): boolean;
};

interface FlagManagerConstructor {
  readonly None: FlagManager.None;
  new <T extends object>(initialValues: ValidFlagEntries<T>): FlagManager<ValidFlagEntries<T>>;
}

declare const FlagManager: FlagManagerConstructor;
export = FlagManager;
