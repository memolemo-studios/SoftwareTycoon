import Roact from "@rbxts/roact";
import { VerticalListConstraint } from "interface/components/common/constraint/list/vertical";
import { StaticRipple } from "interface/components/common/ripples/static";
import { makeStory } from "shared/utils/story";

export = makeStory(() => (
  <>
    <VerticalListConstraint Key="Constraint" />
    <StaticRipple Key="CenterRipple" ripplePosition={UDim2.fromScale(0.5, 0.5)} size={UDim2.fromOffset(200, 50)} />
    <StaticRipple Key="OffsetRipple" ripplePosition={UDim2.fromOffset(10, 10)} size={UDim2.fromOffset(200, 100)} />
  </>
));
