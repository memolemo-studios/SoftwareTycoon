import Roact from "@rbxts/roact";
import { FullBackground } from "interface/components/common/background/full";
import { VerticalListConstraint } from "interface/components/common/constraint/list/vertical";
import { StaticRipple } from "interface/components/common/ripples/static";
import { Typography } from "interface/components/common/typography/default";
import { MaterialColors } from "interface/definitions/theme";
import { makeStory } from "shared/utils/story";

export = makeStory(() => (
  <FullBackground color={MaterialColors.Gray900}>
    <VerticalListConstraint Key="Constraint" />
    <StaticRipple Key="CenterRipple" ripplePosition={UDim2.fromScale(0.5, 0.5)} size={UDim2.fromOffset(200, 50)}>
      <Typography
        alignmentX={Enum.TextXAlignment.Center}
        anchorPoint={new Vector2(0.5, 0.5)}
        color={new Color3(1, 1, 1)}
        text="Click me!"
        position={UDim2.fromScale(0.5, 0.5)}
      />
    </StaticRipple>
    <StaticRipple Key="OffsetRipple" ripplePosition={UDim2.fromOffset(10, 10)} size={UDim2.fromOffset(200, 100)}>
      <Typography
        alignmentX={Enum.TextXAlignment.Center}
        anchorPoint={new Vector2(0.5, 0.5)}
        color={new Color3(1, 1, 1)}
        text="Click me!"
        position={UDim2.fromScale(0.5, 0.5)}
      />
    </StaticRipple>
  </FullBackground>
));
