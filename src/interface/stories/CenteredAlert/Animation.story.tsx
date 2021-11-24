import Roact from "@rbxts/roact";
import { pure, useState } from "@rbxts/roact-hooked";
import { CenteredCard } from "interface/components/alert/center";
import { ToggleHoarcekatButton } from "interface/components/hoarcekat/toggle";
import { makeStory } from "shared/utils/story";

const StoryComponent = pure(() => {
  const [enabled, set_enabled] = useState(true);
  return (
    <>
      <ToggleHoarcekatButton enabled={enabled} onClick={() => set_enabled(!enabled)} />
      <CenteredCard visible={enabled} size={new Vector2(300, 200)} />
    </>
  );
});

export = makeStory(() => <StoryComponent />);
