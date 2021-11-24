export type RemoteResponse<S, F> =
  | {
      success: true;
      value: S;
    }
  | {
      success: false;
      reason: F;
    };
