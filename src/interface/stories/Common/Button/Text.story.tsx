import Roact from "@rbxts/roact";
import { FullBackground } from "interface/components/common/background/full";
import { TextButton } from "interface/components/common/button/text";
import { VerticalListConstraint } from "interface/components/common/constraint/list/vertical";
import Theme from "interface/definitions/theme";
import { makeStory } from "shared/utils/story";

export = makeStory(() => (
  <FullBackground color={Theme.ColorWhite}>
    <VerticalListConstraint Key="ListConstraint" padding={new UDim(0, 4)} />
    <TextButton Key="Button1" layoutOrder={0} text="Primary" type="Primary" />
    <TextButton Key="Button2" layoutOrder={1} text="Secondary" type="Secondary" />
    <TextButton Key="Button3" layoutOrder={2} text="Outlined" type="Outlined" />
    <TextButton Key="Button4" layoutOrder={3} text="Text" type="Text" />
    <TextButton Key="Button4" layoutOrder={4} enabled={false} text="Disabled" type="Primary" />
  </FullBackground>
));
