import Roact from "@rbxts/roact";
import { VerticalListConstraint } from "interface/components/common/constraint/list/vertical";
import { TouchRipple } from "interface/components/common/ripples/touch";
import { makeStory } from "shared/utils/story";

export = makeStory(() => (
  <>
    <VerticalListConstraint Key="Constraint" />
    <TouchRipple Key="TouchRipple1" size={UDim2.fromOffset(200, 50)} />
    <TouchRipple Key="TouchRipple2" size={UDim2.fromOffset(200, 100)} />
  </>
));
