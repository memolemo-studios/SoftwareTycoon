import Roact from "@rbxts/roact";
import { TextButton } from "interface/components/common/button/text";
import { Card } from "interface/components/common/card/default";
import { VerticalListConstraint } from "interface/components/common/constraint/list/vertical";
import { InputTextbox } from "interface/components/common/input/textbox";
import { FullLine } from "interface/components/common/others/fullLine";
import { Typography } from "interface/components/common/typography/default";
import { makeStory } from "shared/utils/story";

export = makeStory(() => (
  <Card size={UDim2.fromOffset(200, 200)}>
    <VerticalListConstraint Key="Constraint" />
    <FullLine Key="HeaderLine" layoutOrder={0} height={30}>
      <Typography
        anchorPoint={new Vector2(0.5, 0)}
        Key="Header"
        position={UDim2.fromScale(0.5, 0)}
        type="Header"
        text="Hello world!"
      />
    </FullLine>
    <InputTextbox layoutOrder={1} size={new UDim2(1, 0, 0, 50)} />
    <FullLine Key="ButtonLine" layoutOrder={2} height={30}>
      <TextButton anchorPoint={new Vector2(0.5, 0)} type="Primary" position={UDim2.fromScale(0.5, 0)} text="Yes" />
    </FullLine>
  </Card>
));
