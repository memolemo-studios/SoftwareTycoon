import Roact from "@rbxts/roact";
import { FullBackground } from "interface/components/common/background/full";
import { IconButton } from "interface/components/common/button/icon";
import { VerticalListConstraint } from "interface/components/common/constraint/list/vertical";
import { EqualPadding } from "interface/components/common/constraint/padding/equal";
import { MaterialColors } from "interface/definitions/theme";
import { makeStory } from "shared/utils/story";

export = makeStory(() => (
  <FullBackground color={MaterialColors.Gray900}>
    <EqualPadding Key="Padding" scale={new UDim(0, 8)} />
    <VerticalListConstraint Key="ListConstraint" />
    <IconButton Key="StartButton" type="StarFilled" />
    <IconButton Key="CloseButton" type="Close" onClick={() => print("Closing!")} />
    <IconButton Key="DisabledButton" enabled={false} type="Error" />
  </FullBackground>
));
