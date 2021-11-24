import Roact from "@rbxts/roact";
import { pure, useState } from "@rbxts/roact-hooked";
import { ToggleHoarcekatButton } from "interface/components/hoarcekat/toggle";
import { Loading } from "interface/game/apps/loading";
import { makeStory } from "shared/utils/story";

// intrinsic elements conflict, kinda broke my styling
const StoryComponent = pure(() => {
  const [visible, set_visible] = useState(true);
  return (
    <>
      <ToggleHoarcekatButton onClick={() => set_visible(!visible)} enabled={visible} />
      <Loading visible={visible} />
    </>
  );
});

export = makeStory(() => <StoryComponent />);
