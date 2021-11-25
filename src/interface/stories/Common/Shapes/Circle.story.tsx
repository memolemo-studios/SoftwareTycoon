import Roact from "@rbxts/roact";
import { VerticalListConstraint } from "interface/components/common/constraint/list/vertical";
import { Circle } from "interface/components/common/shapes/circle";
import Theme, { MaterialColors } from "interface/definitions/theme";
import { makeStory } from "shared/utils/story";

export = makeStory(() => (
  <>
    <VerticalListConstraint Key="Constraint" />
    <Circle Key="Circle1" color={Theme.ColorBlack} size={UDim2.fromOffset(200, 200)} />
    <Circle Key="Circle2" color={MaterialColors.Blue100} size={UDim2.fromOffset(300, 300)} />
  </>
));
