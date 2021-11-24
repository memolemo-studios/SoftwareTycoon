import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { VerticalListConstraint } from "interface/components/constraints/list/vertical";
import { Icon } from "interface/components/icon";
import { Text } from "interface/components/typography/text";
import Theme from "interface/definitions/theme";
import { makeStory } from "shared/utils/story";

const IconShowcase = ({ type: icon_type }: { type: Theme.IconTypes }) => {
  return (
    <frame BackgroundTransparency={1}>
      <VerticalListConstraint
        horizontalAlignment={Enum.HorizontalAlignment.Center}
        verticalAlignment={Enum.VerticalAlignment.Center}
      />
      <Icon anchorPoint={new Vector2(0.5, 0)} type={icon_type} />
      <Text alignmentX={Enum.TextXAlignment.Center} color={new Color3(1, 1, 1)} type="Normal" text={icon_type} />
    </frame>
  );
};

export = makeStory(() => {
  const showcases = new Array<Roact.Element>();
  for (const icon_type of Object.keys(Theme.IconUrls)) {
    showcases.push(<IconShowcase Key={icon_type} type={icon_type} />);
  }
  return (
    <>
      <uigridlayout
        Key="Constraint"
        CellSize={UDim2.fromOffset(100, 100)}
        HorizontalAlignment={Enum.HorizontalAlignment.Left}
        VerticalAlignment={Enum.VerticalAlignment.Top}
        FillDirection={Enum.FillDirection.Vertical}
        SortOrder={Enum.SortOrder.Name}
      />
      {showcases}
    </>
  );
});
