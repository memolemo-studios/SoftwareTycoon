import Roact from "@rbxts/roact";
import { pure, useState } from "@rbxts/roact-hooked";
import { ToggleHoarcekatButton } from "interface/components/common/hoarcekat/toggle";
import { PopupAlert } from "interface/components/game/alert/popup";
import { makeStory } from "shared/utils/story";

const StoryComponent = pure(() => {
  const [enabled, set_enabled] = useState(true);
  return (
    <>
      <ToggleHoarcekatButton Key="Clicker" enabled={enabled} onClick={() => set_enabled(!enabled)} />
      <PopupAlert
        iconType="Warning"
        Key="Alert"
        visible={enabled}
        onClose={() => {}}
        position={UDim2.fromOffset(0, 200)}
        title="Animation Test"
        message="Hope this is not laggy at all"
        buttons={[
          { text: "Yep!", onClick: () => print("You're definitely right.") },
          { text: "Nope", onClick: () => print("Cool!") },
        ]}
      />
    </>
  );
});

export = makeStory(() => <StoryComponent />);
