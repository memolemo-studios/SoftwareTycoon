import Roact from "@rbxts/roact";
import { VerticalListConstraint } from "interface/components/constraints/list/vertical";
import { Text } from "interface/components/typography/text";
import { makeStory } from "shared/utils/story";

// white box is there because some people would like to use
// dark or light theme in roblox studio
export = makeStory(() => (
  <frame BorderSizePixel={0} BackgroundColor3={new Color3(1, 1, 1)} Size={UDim2.fromScale(1, 1)}>
    <VerticalListConstraint />
    <Text text="Header" type="Header" />
    <Text text="Subheading" type="Subheading" />
    <Text text="Normal" type="Normal" />
  </frame>
));
