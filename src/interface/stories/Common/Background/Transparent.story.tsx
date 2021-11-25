import Roact from "@rbxts/roact";
import { TransparentBackground } from "interface/components/common/background/transparent";
import { Typography } from "interface/components/common/typography/default";
import { MaterialColors } from "interface/definitions/theme";
import { makeStory } from "shared/utils/story";

export = makeStory(() => (
  <TransparentBackground>
    <Typography
      Key="NoticeText"
      anchorPoint={new Vector2(0.5, 0.5)}
      color={MaterialColors.Gray400}
      type="Normal"
      position={UDim2.fromScale(0.5, 0.5)}
      text="This is a test for 'TransparentBackground' component, should be a ghost..."
    />
  </TransparentBackground>
));
