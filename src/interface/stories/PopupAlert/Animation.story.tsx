import Roact from "@rbxts/roact";
import { pure, useState } from "@rbxts/roact-hooked";
import { PopupAlert } from "interface/components/alert/popup";
import { ToggleHoarcekatButton } from "interface/components/hoarcekat/toggle";
import { makeStory } from "shared/utils/story";

const StoryComponent = pure(() => {
  const [enabled, set_enabled] = useState(true);
  return (
    <>
      <ToggleHoarcekatButton enabled={enabled} onClick={() => set_enabled(!enabled)} />
      <frame
        AnchorPoint={new Vector2(0, 1)}
        BackgroundTransparency={1}
        Size={UDim2.fromOffset(400, 200)}
        Position={UDim2.fromScale(0, 1)}
      >
        <PopupAlert
          iconType="Warning"
          visible={enabled}
          onClose={() => {}}
          title="Animation Test"
          message="Hope this is not laggy at all"
          buttons={[
            { text: "Yep!", onClick: () => print("You're definitely right.") },
            { text: "Nope", onClick: () => print("Cool!") },
          ]}
        />
      </frame>
    </>
  );
});

export = makeStory(() => {
  return <StoryComponent />;
});
