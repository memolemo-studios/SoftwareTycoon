import Roact from "@rbxts/roact";
import { pure, useEffect, useState } from "@rbxts/roact-hooked";
import { Card } from "interface/components/card";
import { makeStory } from "shared/utils/story";
import { Thread } from "shared/utils/thread";

// intrinsic elements conflict, kinda broke my styling
const StoryComponent = pure(() => {
  const [position, set_position] = useState(new UDim2());
  const [size, set_size] = useState(new UDim2());

  // in a loop thread
  useEffect(() => {
    const connection = Thread.loop(2, () => {
      set_position(UDim2.fromScale(math.random(), math.random()));
      set_size(UDim2.fromScale(math.random(), math.random()));
    });
    return () => connection.Disconnect();
  });

  return <Card position={position} size={size} />;
});

export = makeStory(() => <StoryComponent />);
