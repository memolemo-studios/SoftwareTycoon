export type SerializedOption<T extends defined> =
  | {
      type: "Some";
      value: T;
    }
  | {
      type: "None";
    };

export type SerializedResult<O extends defined, E extends defined> =
  | {
      type: "Ok";
      value: O;
    }
  | {
      type: "Err";
      value: E;
    };
