import Roact from "@rbxts/roact";
import { pure, useState } from "@rbxts/roact-hooked";
import { ToggleHoarcekatButton } from "interface/components/hoarcekat/toggle";
import { Tooltip } from "interface/components/tooltip";
import { makeStory } from "shared/utils/story";

// intrinsic elements conflict, kinda broke my styling
const StoryComponent = pure(() => {
  const [visible, set_visible] = useState(true);
  return (
    <>
      <Tooltip
        anchorPoint={new Vector2(0.5, 1)}
        position={new UDim2(0.5, 0, 1, -10)}
        size={UDim2.fromOffset(200, 50)}
        visible={visible}
      />
      <ToggleHoarcekatButton enabled={visible} onClick={() => set_visible(!visible)} />
    </>
  );
});

export = makeStory(() => <StoryComponent />);
