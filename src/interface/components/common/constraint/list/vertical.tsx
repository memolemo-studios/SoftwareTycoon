import Roact from "@rbxts/roact";
import Theme from "interface/definitions/theme";
import { ListConstraintProps } from "./types";

/** A straightforward component that constraints to an vertical list */
export function VerticalListConstraint(props: ListConstraintProps) {
  return (
    <uilistlayout
      HorizontalAlignment={props.horizontalAlignment}
      VerticalAlignment={props.verticalAlignment}
      FillDirection={Enum.FillDirection.Vertical}
      Padding={props.padding ?? new UDim(0, Theme.PaddingList)}
      SortOrder={props.sortOrder ?? Enum.SortOrder.LayoutOrder}
    />
  );
}
