import Roact from "@rbxts/roact";
import { Card } from "interface/components/common/card/default";
import { VerticalListConstraint } from "interface/components/common/constraint/list/vertical";
import { Typography } from "interface/components/common/typography/default";
import { Lorems } from "interface/definitions/lorem";
import { makeStory } from "shared/utils/story";

export = makeStory(() => (
  <Card size={UDim2.fromOffset(350, 400)}>
    <VerticalListConstraint Key="Constraint" sortOrder={Enum.SortOrder.LayoutOrder} />
    <Typography Key="Title" layoutOrder={0} text="Lorem ipsum" type="Header" />
    <Typography
      Key="Message"
      layoutOrder={1}
      alignmentX={Enum.TextXAlignment.Left}
      text={Lorems.Lorem1}
      type="Normal"
      widthOffset={280}
    />
  </Card>
));
