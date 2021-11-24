import Roact from "@rbxts/roact";
import Theme from "interface/definitions/theme";

/** Default game corner constraint */
export function GameCornerConstraint() {
  return <uicorner CornerRadius={new UDim(0, Theme.RadiusDefaultCornerConstraint)} />;
}
