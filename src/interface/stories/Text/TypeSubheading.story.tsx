import Roact from "@rbxts/roact";
import { VerticalListConstraint } from "interface/components/constraints/list/vertical";
import { Text } from "interface/components/typography/text";
import { makeStory } from "shared/utils/story";

export = makeStory(() => (
  <frame BorderSizePixel={0} BackgroundColor3={new Color3(1, 1, 1)} Size={UDim2.fromScale(1, 1)}>
    <VerticalListConstraint />
    <Text layoutOrder={1} text="Size16: The quick brown fox jumps over the lazy dog" textSize={16} type="Subheading" />
    <Text layoutOrder={2} text="Size18: The quick brown fox jumps over the lazy dog" textSize={18} type="Subheading" />
    <Text layoutOrder={3} text="Size20: The quick brown fox jumps over the lazy dog" textSize={20} type="Subheading" />
    <Text layoutOrder={4} text="Size22: The quick brown fox jumps over the lazy dog" textSize={22} type="Subheading" />
    <Text layoutOrder={5} text="Size24: The quick brown fox jumps over the lazy dog" textSize={24} type="Subheading" />
    <Text layoutOrder={6} text="Size26: The quick brown fox jumps over the lazy dog" textSize={26} type="Subheading" />
    <Text layoutOrder={7} text="Size28: The quick brown fox jumps over the lazy dog" textSize={28} type="Subheading" />
    <Text layoutOrder={8} text="Size30: The quick brown fox jumps over the lazy dog" textSize={30} type="Subheading" />
    <Text layoutOrder={9} text="Size32: The quick brown fox jumps over the lazy dog" textSize={32} type="Subheading" />
    <Text layoutOrder={10} text="Size34: The quick brown fox jumps over the lazy dog" textSize={34} type="Subheading" />
    <Text layoutOrder={11} text="Size36: The quick brown fox jumps over the lazy dog" textSize={36} type="Subheading" />
  </frame>
));
