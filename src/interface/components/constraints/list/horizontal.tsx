import Roact from "@rbxts/roact";
import Theme from "interface/definitions/theme";

interface Props {
  horizontalAlignment?: Enum.HorizontalAlignment;
  verticalAlignment?: Enum.VerticalAlignment;
  sortOrder?: Enum.SortOrder;
  padding?: UDim;
}

export function HorizontalListConstraint(props: Roact.PropsWithChildren<Props>) {
  return (
    <uilistlayout
      HorizontalAlignment={props.horizontalAlignment}
      VerticalAlignment={props.verticalAlignment}
      FillDirection={Enum.FillDirection.Horizontal}
      Padding={props.padding ?? new UDim(0, Theme.ListPadding)}
      SortOrder={props.sortOrder ?? Enum.SortOrder.LayoutOrder}
    />
  );
}
