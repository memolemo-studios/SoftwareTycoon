import Roact from "@rbxts/roact";
import { HorizontalListConstraint } from "interface/components/constraints/list/horizontal";
import { AdjustableText } from "interface/components/typography/adjustableText";
import { Lorems } from "interface/definitions/lorem";
import { makeStory } from "shared/utils/story";

// white box is there because some people would like to use
// dark or light theme in roblox studio
export = makeStory(() => (
  <frame BorderSizePixel={0} BackgroundColor3={new Color3(1, 1, 1)} Size={UDim2.fromScale(1, 1)}>
    <HorizontalListConstraint />
    <AdjustableText layoutOrder={0} type="Normal" text={Lorems.Lorem1} widthOffset={100} />
    <AdjustableText layoutOrder={1} type="Subheading" text={Lorems.Lorem2} widthOffset={200} />
    <AdjustableText layoutOrder={2} type="Header" text={Lorems.Lorem1} widthOffset={300} />
  </frame>
));
