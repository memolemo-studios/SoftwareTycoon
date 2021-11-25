import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { FullBackground } from "interface/components/common/background/full";
import { VerticalListConstraint } from "interface/components/common/constraint/list/vertical";
import { Icon } from "interface/components/common/icon/default";
import { Typography } from "interface/components/common/typography/default";
import Theme, { MaterialColors } from "interface/definitions/theme";
import { makeStory } from "shared/utils/story";

const IconShowcase = ({ type: icon_type }: { type: Theme.TypesIcon }) => {
  return (
    <frame BackgroundTransparency={1}>
      <VerticalListConstraint
        Key="Constraint"
        horizontalAlignment={Enum.HorizontalAlignment.Center}
        verticalAlignment={Enum.VerticalAlignment.Center}
      />
      <Icon Key="Icon" layoutOrder={0} anchorPoint={new Vector2(0.5, 0)} type={icon_type} />
      <Typography
        Key="Text"
        color={Theme.ColorWhite}
        layoutOrder={1}
        alignmentX={Enum.TextXAlignment.Center}
        type="Normal"
        text={icon_type}
      />
    </frame>
  );
};

export = makeStory(() => {
  const showcases = new Array<Roact.Element>();
  for (const icon_type of Object.keys(Theme.ImageIcons)) {
    showcases.push(<IconShowcase Key={icon_type} type={icon_type} />);
  }
  return (
    <FullBackground color={MaterialColors.Gray900}>
      <uigridlayout
        Key="Constraint"
        CellSize={UDim2.fromOffset(100, 100)}
        HorizontalAlignment={Enum.HorizontalAlignment.Left}
        VerticalAlignment={Enum.VerticalAlignment.Top}
        FillDirection={Enum.FillDirection.Vertical}
        SortOrder={Enum.SortOrder.Name}
      />
      {showcases}
    </FullBackground>
  );
});
