import Roact from "@rbxts/roact";
import { TextButton } from "interface/components/button/text";
import { VerticalListConstraint } from "interface/components/constraints/list/vertical";
import { makeStory } from "shared/utils/story";

export = makeStory(() => (
  <>
    <VerticalListConstraint padding={new UDim(0, 4)} />
    <TextButton layoutOrder={0} text="Primary" type="Primary" />
    <TextButton layoutOrder={1} text="Secondary" type="Secondary" />
    <TextButton layoutOrder={2} text="Outlined" type="Outlined" />
    <TextButton layoutOrder={3} text="Text" type="Text" />
  </>
));