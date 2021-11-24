import Roact from "@rbxts/roact";
import { Outline } from "interface/components/gfx/outline";
import { Text } from "interface/components/typography/text";
import { makeStory } from "shared/utils/story";

const OutlineDebug = (props: { radius: number }) => {
  return (
    <Outline radius={props.radius} size={UDim2.fromOffset(200, 200)}>
      <Text
        anchorPoint={new Vector2(0.5, 0.5)}
        alignmentX={Enum.TextXAlignment.Center}
        type="Normal"
        color={new Color3(1, 1, 1)}
        text={`${props.radius}x`}
        position={UDim2.fromScale(0.5, 0.5)}
      />
    </Outline>
  );
};

export = makeStory(() => (
  <>
    <uigridlayout
      HorizontalAlignment={Enum.HorizontalAlignment.Left}
      VerticalAlignment={Enum.VerticalAlignment.Top}
      FillDirection={Enum.FillDirection.Vertical}
    />
    <OutlineDebug radius={1} />
    <OutlineDebug radius={0.7} />
    <OutlineDebug radius={0.5} />
    <OutlineDebug radius={0.2} />
    <OutlineDebug radius={0.1} />
    <OutlineDebug radius={0.05} />
    <OutlineDebug radius={0.02} />
  </>
));
