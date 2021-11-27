import Roact from "@rbxts/roact";
import { FullBackground } from "interface/components/common/background/full";
import { VerticalListConstraint } from "interface/components/common/constraint/list/vertical";
import { TouchRipple } from "interface/components/common/ripples/touch";
import { Typography } from "interface/components/common/typography/default";
import { MaterialColors } from "interface/definitions/theme";
import { makeStory } from "shared/utils/story";

export = makeStory(() => (
  <FullBackground color={MaterialColors.Gray900}>
    <VerticalListConstraint Key="Constraint" />
    <TouchRipple Key="TouchRipple1" size={UDim2.fromOffset(200, 50)}>
      <Typography
        alignmentX={Enum.TextXAlignment.Center}
        anchorPoint={new Vector2(0.5, 0.5)}
        color={new Color3(1, 1, 1)}
        text="Click me!"
        position={UDim2.fromScale(0.5, 0.5)}
      />
    </TouchRipple>
    <TouchRipple Key="TouchRipple2" size={UDim2.fromOffset(200, 100)}>
      <Typography
        alignmentX={Enum.TextXAlignment.Center}
        anchorPoint={new Vector2(0.5, 0.5)}
        color={new Color3(1, 1, 1)}
        text="Click me!"
        position={UDim2.fromScale(0.5, 0.5)}
      />
    </TouchRipple>
    <TouchRipple Key="DisabledRipple" enabled={false} size={UDim2.fromOffset(200, 50)}>
      <Typography
        alignmentX={Enum.TextXAlignment.Center}
        anchorPoint={new Vector2(0.5, 0.5)}
        color={new Color3(1, 1, 1)}
        text="This ripple is disabled"
        position={UDim2.fromScale(0.5, 0.5)}
      />
    </TouchRipple>
  </FullBackground>
));
