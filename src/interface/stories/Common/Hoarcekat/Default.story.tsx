import Roact from "@rbxts/roact";
import { pure, useState } from "@rbxts/roact-hooked";
import { ToggleHoarcekatButton } from "interface/components/common/hoarcekat/toggle";
import { makeStory } from "shared/utils/story";

const StoryComponent = pure(() => {
  const [enabled, set_enabled] = useState(true);
  return (
    <>
      <ToggleHoarcekatButton enabled={enabled} onClick={() => set_enabled(!enabled)} />
      <textlabel
        AnchorPoint={new Vector2(0.5, 0.5)}
        Font={Enum.Font.SourceSans}
        Position={UDim2.fromScale(0.5, 0.5)}
        Size={UDim2.fromOffset(200, 50)}
        Text={enabled ? "Enabled" : "Disabled"}
        TextSize={18}
      />
    </>
  );
});

export = makeStory(() => <StoryComponent />);
