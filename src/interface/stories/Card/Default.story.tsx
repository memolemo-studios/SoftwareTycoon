import Roact from "@rbxts/roact";
import { Card } from "interface/components/card";
import { VerticalListConstraint } from "interface/components/constraints/list/vertical";
import { Text } from "interface/components/typography/text";
import { Lorems } from "interface/definitions/lorem";
import { makeStory } from "shared/utils/story";

export = makeStory(() => (
  <Card size={UDim2.fromOffset(350, 400)}>
    <VerticalListConstraint sortOrder={Enum.SortOrder.LayoutOrder} />
    <Text layoutOrder={0} text="Lorem ipsum" type="Header" />
    <Text layoutOrder={1} alignmentX={Enum.TextXAlignment.Left} text={Lorems.Lorem1} type="Normal" widthOffset={280} />
  </Card>
));
