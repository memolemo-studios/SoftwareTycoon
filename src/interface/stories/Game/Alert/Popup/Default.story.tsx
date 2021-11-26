import Roact from "@rbxts/roact";
import { VerticalListConstraint } from "interface/components/common/constraint/list/vertical";
import { PopupAlert } from "interface/components/game/alert/popup";
import { makeStory } from "shared/utils/story";

export = makeStory(() => (
  <>
    <VerticalListConstraint />
    <PopupAlert
      iconType="Error"
      title="Game error occurred!"
      onClose={() => print("Closing?")}
      message="There’s something wrong with the game. Please click ‘Show more’ for more information."
      buttons={[{ text: "Show more" }, { text: "Please find someone" }]}
      visible={true}
    />
    <PopupAlert iconType="Checkmark" title="Story Test" visible={true} />
  </>
));
