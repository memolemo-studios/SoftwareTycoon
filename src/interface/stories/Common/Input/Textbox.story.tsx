import Roact from "@rbxts/roact";
import { pure, useState } from "@rbxts/roact-hooked";
import { FullBackground } from "interface/components/common/background/full";
import { VerticalListConstraint } from "interface/components/common/constraint/list/vertical";
import { InputTextbox } from "interface/components/common/input/textbox";
import { Typography } from "interface/components/common/typography/default";
import Theme, { MaterialColors } from "interface/definitions/theme";
import { makeStory } from "shared/utils/story";

const StoryComponent = pure(() => {
  const [text, set_text] = useState("");
  return (
    <FullBackground color={MaterialColors.Gray900}>
      <VerticalListConstraint />
      <InputTextbox onChange={set_text} layoutOrder={1} size={UDim2.fromOffset(200, 50)} />
      <Typography color={Theme.ColorWhite} layoutOrder={2} type="Normal" text={`Result: ${text}`} />
      <InputTextbox
        onChange={set_text}
        layoutOrder={3}
        enabled={false}
        placeholder="Disabled text box"
        size={UDim2.fromOffset(200, 50)}
      />
      <Typography color={Theme.ColorWhite} layoutOrder={4} type="Normal" text={`Result: ${text}`} />
    </FullBackground>
  );
});

export = makeStory(() => {
  return <StoryComponent />;
});
