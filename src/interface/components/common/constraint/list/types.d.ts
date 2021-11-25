import Roact from "@rbxts/roact";

export interface ListConstraintProps extends Roact.PropsWithChildren {
  horizontalAlignment?: Enum.HorizontalAlignment;
  verticalAlignment?: Enum.VerticalAlignment;
  sortOrder?: Enum.SortOrder;
  padding?: UDim;
}
