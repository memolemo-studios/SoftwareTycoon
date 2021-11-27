import { Result } from "@rbxts/rust-classes";
import { t } from "@rbxts/t";
import { RemoteResponse } from "types/response";

export namespace ResponseUtil {
  /** Makes a server response object from Result object */
  export function makeFromResult<S, F>(result: Result<S, F>): RemoteResponse<S, F> {
    if (result.isErr()) {
      return {
        success: false,
        reason: result.unwrapErr(),
      };
    }
    return {
      success: true,
      value: result.unwrap(),
    };
  }

  /**
   * Makes a typechecker for server response with two parameters.
   *
   * One parameter is for success value and other is failed value.
   */
  export function makeTypechecker<S, F>(
    successCheck: t.check<S>,
    failureCheck: t.check<F>,
  ): t.check<RemoteResponse<S, F>> {
    return t.union(
      t.interface({
        success: t.literal(true),
        value: successCheck,
      }),
      t.interface({
        success: t.literal(false),
        reason: failureCheck,
      }),
    );
  }
}
