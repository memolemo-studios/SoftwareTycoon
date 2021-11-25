import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { pure, useState } from "@rbxts/roact-hooked";
import { Card } from "interface/components/common/card/default";
import { HorizontalListConstraint } from "interface/components/common/constraint/list/horizontal";
import { VerticalListConstraint } from "interface/components/common/constraint/list/vertical";
import { ToggleSwitch } from "interface/components/common/switch/toggle";
import { Typography } from "interface/components/common/typography/default";
import Theme from "interface/definitions/theme";
import { makeStory } from "shared/utils/story";

interface Props {
  type: Theme.TypesToggleSwitch;
}

const ToggleTest = pure<Props>(props => {
  const [enabled, set_enabled] = useState(true);
  return (
    <Card size={UDim2.fromOffset(120, 100)}>
      <VerticalListConstraint horizontalAlignment={Enum.HorizontalAlignment.Center} />
      <Typography Key="Type" layoutOrder={0} type="Normal" text={props.type} />
      <ToggleSwitch
        Key="Switch"
        layoutOrder={1}
        type={props.type}
        checked={enabled}
        onClick={() => set_enabled(!enabled)}
      />
    </Card>
  );
});

const StoryComponent = pure(() => {
  return (
    <>
      <HorizontalListConstraint />
      {Object.keys(Theme.ColorsToggleSwitchInner).map(slider_type => (
        <ToggleTest Key={slider_type} type={slider_type} />
      ))}
    </>
  );
});

export = makeStory(() => <StoryComponent />);
