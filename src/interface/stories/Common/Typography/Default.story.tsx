import Roact from "@rbxts/roact";
import { FullBackground } from "interface/components/common/background/full";
import { VerticalListConstraint } from "interface/components/common/constraint/list/vertical";
import { Typography } from "interface/components/common/typography/default";
import Theme from "interface/definitions/theme";
import { makeStory } from "shared/utils/story";

// white box is there because some people would like to use
// dark or light theme in roblox studio
export = makeStory(() => (
  <FullBackground color={Theme.ColorWhite}>
    <VerticalListConstraint Key="Constraint" />
    <Typography Key="Header" text="Header" type="Header" />
    <Typography Key="Subheading" text="Subheading" type="Subheading" />
    <Typography Key="Normal" text="Normal" type="Normal" />
  </FullBackground>
));
