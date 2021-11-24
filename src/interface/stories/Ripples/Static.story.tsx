import Roact from "@rbxts/roact";
import { VerticalListConstraint } from "interface/components/constraints/list/vertical";
import { StaticRipple } from "interface/components/gfx/ripples/static";
import { makeStory } from "shared/utils/story";

export = makeStory(() => (
  <>
    <VerticalListConstraint />
    <StaticRipple ripplePosition={UDim2.fromScale(0.5, 0.5)} size={UDim2.fromOffset(200, 50)} />
    <StaticRipple ripplePosition={UDim2.fromOffset(10, 10)} size={UDim2.fromOffset(200, 100)} />
  </>
));
