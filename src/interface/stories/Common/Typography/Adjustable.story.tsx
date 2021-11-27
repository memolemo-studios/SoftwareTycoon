import Roact from "@rbxts/roact";
import { FullBackground } from "interface/components/common/background/full";
import { HorizontalListConstraint } from "interface/components/common/constraint/list/horizontal";
import { AdjustableTypography } from "interface/components/common/typography/adjustable";
import { Lorems } from "interface/definitions/lorem";
import Theme from "interface/definitions/theme";
import { makeStory } from "shared/utils/story";

// white box is there because some people would like to use
// dark or light theme in roblox studio
export = makeStory(() => (
  <FullBackground color={Theme.ColorWhite}>
    <HorizontalListConstraint Key="Constraint" />
    <AdjustableTypography Key="Normal" layoutOrder={0} type="Normal" text={Lorems.Lorem1} widthOffset={100} />
    <AdjustableTypography Key="Subheading" layoutOrder={1} type="Subheading" text={Lorems.Lorem2} widthOffset={200} />
    <AdjustableTypography Key="Header" layoutOrder={2} type="Header" text={Lorems.Lorem1} widthOffset={300} />
  </FullBackground>
));
