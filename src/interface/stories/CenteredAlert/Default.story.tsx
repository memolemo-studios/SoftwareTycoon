import Roact from "@rbxts/roact";
import { CenteredCard } from "interface/components/alert/center";
import { Text } from "interface/components/typography/text";
import { makeStory } from "shared/utils/story";

export = makeStory(() => (
  <CenteredCard size={new Vector2(200, 200)}>
    <Text type="Normal" text="This is a test for 'CenteredCard'" />
  </CenteredCard>
));
