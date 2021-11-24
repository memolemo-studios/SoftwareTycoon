import Roact from "@rbxts/roact";
import { IconButton } from "interface/components/button/icon";
import { VerticalListConstraint } from "interface/components/constraints/list/vertical";
import { EqualPadding } from "interface/components/constraints/padding/equal";
import { makeStory } from "shared/utils/story";

export = makeStory(() => (
  <>
    <EqualPadding scale={new UDim(0, 8)} />
    <VerticalListConstraint />
    <IconButton type="StarFilled" />
    <IconButton type="Close" onClick={() => print("Closing!")} />
  </>
));
