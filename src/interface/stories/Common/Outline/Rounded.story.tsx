import Roact from "@rbxts/roact";
import { FullBackground } from "interface/components/common/background/full";
import { RoundedOutline } from "interface/components/common/effect/outline/rounded";
import { Typography } from "interface/components/common/typography/default";
import Theme from "interface/definitions/theme";
import { makeStory } from "shared/utils/story";

const OutlineDebug = (props: { radius: number }) => {
  return (
    <RoundedOutline color={Theme.ColorBlack} radius={props.radius} size={UDim2.fromOffset(200, 200)}>
      <Typography
        Key="Text"
        anchorPoint={new Vector2(0.5, 0.5)}
        alignmentX={Enum.TextXAlignment.Center}
        type="Normal"
        color={Theme.ColorBlack}
        text={`${props.radius}x`}
        position={UDim2.fromScale(0.5, 0.5)}
      />
    </RoundedOutline>
  );
};

export = makeStory(() => (
  <FullBackground color={Theme.ColorWhite}>
    <uigridlayout
      Key="GridLayout"
      HorizontalAlignment={Enum.HorizontalAlignment.Left}
      VerticalAlignment={Enum.VerticalAlignment.Top}
      FillDirection={Enum.FillDirection.Vertical}
    />
    <OutlineDebug Key="Debug-1x" radius={1} />
    <OutlineDebug Key="Debug-0.7x" radius={0.7} />
    <OutlineDebug Key="Debug-0.5x" radius={0.5} />
    <OutlineDebug Key="Debug-0.2x" radius={0.2} />
    <OutlineDebug Key="Debug-0.1x" radius={0.1} />
    <OutlineDebug Key="Debug-0.05x" radius={0.05} />
    <OutlineDebug Key="Debug-0.02x" radius={0.02} />
  </FullBackground>
));
