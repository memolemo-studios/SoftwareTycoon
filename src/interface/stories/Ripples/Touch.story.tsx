import Roact from "@rbxts/roact";
import { VerticalListConstraint } from "interface/components/constraints/list/vertical";
import { TouchRipple } from "interface/components/gfx/ripples/touch";
import { makeStory } from "shared/utils/story";

export = makeStory(() => (
  <>
    <VerticalListConstraint />
    <TouchRipple size={UDim2.fromOffset(200, 50)} />
    <TouchRipple size={UDim2.fromOffset(200, 100)} />
  </>
));
